import { Elysia, t } from "elysia";
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
  email: t.String({ format: "email" }),
  password: t.String(),
});

// ============================================================
// Controller
// ============================================================

export const AuthController = new Elysia({ prefix: "/auth" })

  // ----------------------------------------------------------
  // POST /auth/register
  // Dipanggil dari form tambah staff di AdminPage
  // ----------------------------------------------------------
  .post(
    "/register",
    async ({ body, set }) => {
      const { username, email, password, role } = body;

      // Cek email duplikat
      const existingEmail = await UserModel.findByEmail(email);
      if (existingEmail) {
        set.status = 400;
        return { error: "Email sudah terdaftar." };
      }

      // Hash password dengan bcrypt via Bun built-in
      const hashedPassword = await Bun.password.hash(password, {
        algorithm: "bcrypt",
        cost: 10,
      });

      // Simpan ke DB
      await UserModel.create({
        username,
        email,
        password: hashedPassword,
        role,
      });

      set.redirect = "/admin?tab=staff";
    },
    { body: RegisterBody }
  )

  // ----------------------------------------------------------
  // POST /auth/login
  // Form di LoginPage.ts POST ke sini
  // ----------------------------------------------------------
  .post(
    "/login",
    async ({ body, set, cookie }) => {
      const { email, password } = body;

      // Cari user by email
      const user = await UserModel.findByEmail(email);
      if (!user) {
        // Jangan kasih tahu field mana yang salah (security)
        return LoginView.HalamanLogin("Username atau password salah.");
      }

      // Verifikasi password vs hash di DB
      const isValid = await Bun.password.verify(password, user.password);
      if (!isValid) {
        return LoginView.HalamanLogin("Username atau password salah.");
      }

      // Simpan session di cookie (httpOnly supaya tidak bisa dibaca JS)
      if (!cookie?.session) {
        set.status = 500;
        return { error: "Session tidak tersedia." };
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

      // Redirect sesuai role
      const redirectMap: Record<string, string> = {
        admin:  "/admin?tab=stok",
        kasir:  "/pesanan",
        dapur:  "/pesanan",
        kurir:  "/preorder",
      };

      set.redirect = redirectMap[user.role] ?? "/";
    },
    { body: LoginBody }
  )

  // ----------------------------------------------------------
  // GET /auth/logout
  // ----------------------------------------------------------
  .get("/logout", ({ cookie, set }) => {
    cookie.session?.remove();
    set.redirect = "/login";
  });