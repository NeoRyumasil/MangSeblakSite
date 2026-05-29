import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import { staticPlugin } from "@elysiajs/static"; 

import { LandingView } from './views/pages/LandingPage.ts';
import { MenuView } from "./views/pages/MenuPage.ts";
import { LoginView } from "./views/pages/LoginPage.ts";
import { AdminView } from "./views/pages/AdminPage.ts";
import { StokController } from "./controllers/StokController.ts";
import { AuthController } from "./controllers/Auth/AuthController.ts";
import { StaffController } from "./controllers/StaffController.ts";
import { MenuController } from "./controllers/MenuController.ts";
import { PesananController } from "./controllers/PesananController.ts";
import { MenuModel } from "./models/Menu.ts";
import { StokModel } from "./models/Stok.ts";
import { PesananModel } from "./models/Pesanan.ts";
import { StaffModel } from "./models/Staff.ts";

const app = new Elysia()
  .use(html())
  .use(staticPlugin({
    assets: 'public', 
    prefix: '/public' 
  }))

  // Middleware
  .onBeforeHandle(({ cookie: { session }, path }) => {
    const publicPaths = [
      "/", "/menu", "/login", "/auth/login", "/logout", "/auth/logout", "/proses-pesanan"
    ];

    if (path.startsWith("/public")) return;

    if (publicPaths.includes(path)) return;

    if (!session?.value) {
      return new Response(null, { status: 302, headers: { Location: "/login", "HX-Redirect": "/login" } });
    }
  })

  // Controllers
  .use(AuthController)
  .use(StaffController)
  .use(StokController)
  .use(MenuController)
  .use(PesananController) 

  // Landing View
  .get("/", () => LandingView.HalamanUtama())
  
  // Login View
  .get("/login", () => LoginView.HalamanLogin())
  .get("/logout", () => new Response(null, { status: 302, headers: { Location: "/auth/logout", "HX-Redirect": "/auth/logout" } }))

  // Menu
  .get("/menu", async () => {
    const menusDb = await MenuModel.getAll();
    return MenuView.HalamanMenu(menusDb);
  })

  // Dashboard Admin
  .get("/admin", async () => {
    const stokDb = await StokModel.getAll();
    const pesananDb = await PesananModel.getAll();
    const staffDb = await StaffModel.getAll();

    return AdminView.HalamanDashboard({ 
      stok: stokDb, 
      pesanan: pesananDb, 
      staff: staffDb 
    });
  })

  .listen(3000);

console.log(`🦊 Web Mang Jay berjalan di http://${app.server?.hostname}:${app.server?.port}`);