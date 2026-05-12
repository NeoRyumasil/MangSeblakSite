// file: controllers/StaffController.ts
import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html";
import { StaffView } from "../views/pages/AdminPage";
import { StaffModel } from "../models/Staff";

// Controller untuk manajemen staff
export const StaffController = new Elysia({ prefix: "/admin/staff" })
  .use(html())

  // Tampilkan halaman daftar staff
  .get("/", async () => {
    const staff = await StaffModel.getAll();
    return StaffView.HalamanStaff(staff);
  })

  // Tampilkan halaman registrasi staff baru
  .get("/registrasi", () => StaffView.HalamanRegistrasi())

  // Registrasi staff baru
  .post(
    "/registrasi",
    async ({ body }) => {
      const { username, nama, email, role, password, no_hp } = body;

      // Cek username duplikat via Model
      const isExist = await StaffModel.checkUsernameExists(username);
      if (isExist) {
        return StaffView.HalamanRegistrasi("Username sudah digunakan, pilih yang lain.");
      }

      // Hash password menggunakan bcrypt
      const hashedPassword = await Bun.password.hash(password, { algorithm: "bcrypt", cost: 10 });
      const tanggal_bergabung = new Date().toISOString().slice(0, 10);

      // Simpan via Model
      await StaffModel.create({
        nama, username, email, password: hashedPassword, role, no_hp, tanggal_bergabung
      });

      return new Response(null, {
        status: 302,
        headers: { Location: "/admin/staff", "HX-Redirect": "/admin/staff" },
      });
    },
    {
      body: t.Object({
        nama:     t.String({ minLength: 2 }),
        username: t.String({ minLength: 3 }),
        email:    t.Optional(t.String()),
        password: t.String({ minLength: 8 }),
        no_hp:    t.String({ minLength: 8 }),
        role:     t.Union([
          t.Literal("admin"), t.Literal("kasir"), t.Literal("dapur"), t.Literal("kurir")
        ]),
      }),
    }
  )

  // Tampilkan halaman edit staff
  .get("/edit/:id", async ({ params }) => {
    const staff = await StaffModel.getById(Number(params.id));
    if (!staff) return "Staff tidak ditemukan.";
    return StaffView.HalamanEditStaff(staff);
  })

  // Update data staff
  .post(
    "/update/:id",
    async ({ params, body }) => {
      const id = Number(params.id);
      const { username, nama, no_hp, role } = body;

      // Cek username duplikat via Model 
      const isExist = await StaffModel.checkUsernameExists(username, id);
      if (isExist) {
        const staff = await StaffModel.getById(id);
        if(staff) return StaffView.HalamanEditStaff(staff, "Username sudah digunakan oleh staff lain.");
      }

      // Hash password baru jika diisi, jika tidak biarkan tetap sama
      let newPasswordHash;
      if (body.password && body.password.trim().length > 0) {
        newPasswordHash = await Bun.password.hash(body.password.trim(), { algorithm: "bcrypt", cost: 10 });
      }

      // Update via Model
      await StaffModel.update(id, {
        nama, username, no_hp, role, password: newPasswordHash
      });

      return new Response(null, {
        status: 302,
        headers: { Location: "/admin/staff", "HX-Redirect": "/admin/staff" },
      });
    },
    {
      body: t.Object({
        nama:     t.String({ minLength: 2 }),
        username: t.String({ minLength: 3 }),
        no_hp:    t.String({ minLength: 8 }),
        password: t.Optional(t.String()),
        role:     t.Union([
          t.Literal("admin"), t.Literal("kasir"), t.Literal("dapur"), t.Literal("kurir")
        ]),
      }),
    }
  )

  // Aktifkan staff
  .post("/aktifkan/:id", async ({ params }) => {
    await StaffModel.updateStatus(Number(params.id), 1);
    return new Response(null, { status: 302, headers: { Location: "/admin/staff", "HX-Redirect": "/admin/staff" } });
  })

  // Nonaktifkan staff
  .post("/nonaktifkan/:id", async ({ params }) => {
    await StaffModel.updateStatus(Number(params.id), 0);
    return new Response(null, { status: 302, headers: { Location: "/admin/staff", "HX-Redirect": "/admin/staff" } });
  });