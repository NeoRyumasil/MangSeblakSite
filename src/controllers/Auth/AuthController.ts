import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html";
import { UserModel } from "../../models/User";
import { LoginView } from "../../views/pages/LoginPage";

// ============================================================
// Validasi body
// ============================================================

const RegisterBody = t.Object({
  username: t.String({ minLength: 3 }),
  email:    t.String({ format: "email" }),
  password: t.String({ minLength: 8 }),
  role: t.Union([
    t.Literal("admin"),
    t.Literal("kasir"),
    t.Literal("dapur"),
    t.Literal("kurir"),
  ]),
});

const LoginBody = t.Object({
  username: t.String({ minLength: 3 }),
  password: t.String(),
});

// ============================================================
// Controller
// ============================================================

export const AuthController = new Elysia({ prefix: "/auth" })
  .use(html())

  // Jika ada yang GET /auth/login secara manual, redirect ke halaman utama /login
  .get("/login", ({ set }) => {
    // Cara paling aman melakukan redirect di ElysiaJS versi terbaru:
    set.redirect = "/login";
    return new Response(null, {
      status: 302,
      headers: { Location: "/login" },
    });
  })

  // ----------------------------------------------------------
  // POST /auth/register
  // ----------------------------------------------------------
  .post(
    "/register",
    async ({ body, set }) => {
      const { username, email, password, role } = body;

      const existingEmail = await UserModel.findByEmail(email);
      if (existingEmail) {
        set.status = 400;
        return "Email sudah terdaftar.";
      }

      const hashedPassword = await Bun.password.hash(password, {
        algorithm: "bcrypt",
        cost: 10,
      });

      await UserModel.create({
        username,
        email,
        password: hashedPassword,
        role,
      });

      const targetUrl = "/admin?tab=staff";
      
      // Menggunakan Response bawaan untuk memaksa redirect (menghindari white screen)
      return new Response(null, {
        status: 302,
        headers: {
          Location: targetUrl,
          "HX-Redirect": targetUrl,
        },
      });
    },
    { body: RegisterBody }
  )

  // ----------------------------------------------------------
  // POST /auth/login
  // ----------------------------------------------------------
  .post(
    "/login",
    async ({ body, set, cookie }) => {
      const { username, password } = body;

      const user = await UserModel.findByUsername(username);
      if (!user) {
        return LoginView.HalamanLogin("Username atau password salah.");
      }

      const isValid = await Bun.password.verify(password, user.password);
      if (!isValid) {
        return LoginView.HalamanLogin("Username atau password salah.");
      }

      if (!cookie?.session) {
        set.status = 500;
        return "Session tidak tersedia.";
      }

      cookie.session.set({
        value: JSON.stringify({
          id:       user.id,
          username: user.username,
          email:    user.email,
          role:     user.role,
        }),
        httpOnly: true,
        maxAge:   60 * 60 * 8, // 8 jam
        path:     "/",
      });

      // Redirect map sesuai role
      const redirectMap: Record<string, string> = {
        admin:  "/admin", // Langsung ke dashboard admin
        kasir:  "/pesanan",
        dapur:  "/pesanan",
        kurir:  "/preorder",
      };

      const targetUrl = redirectMap[user.role] ?? "/";
      
      // PERUBAHAN UTAMA: Kembalikan objek Response HTTP murni untuk redirect
      return new Response(null, {
        status: 302,
        headers: {
          Location: targetUrl,
          "HX-Redirect": targetUrl, // Tetap sediakan untuk jaga-jaga jika nanti pakai HTMX
        },
      });
    },
    { body: LoginBody }
  )

  // ----------------------------------------------------------
  // GET /auth/logout
  // ----------------------------------------------------------
  .get("/logout", ({ cookie, set }) => {
    cookie.session?.remove();
    
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/login",
        "HX-Redirect": "/login",
      },
    });
  });