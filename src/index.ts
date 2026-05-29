import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import { staticPlugin } from "@elysiajs/static"; 

import { LandingView } from './views/pages/LandingPage';
import { MenuView } from "./views/pages/MenuPage";
import { LoginView } from "./views/pages/LoginPage";
import { AdminView } from "./views/pages/AdminPage";
import { StokController } from "./controllers/StokController";
import { AuthController } from "./controllers/Auth/AuthController";
import { StaffController } from "./controllers/StaffController";
import { MenuController } from "./controllers/MenuController";
import { PesananController } from "./controllers/PesananController";
import { MenuModel } from "./models/Menu";
import { StokModel } from "./models/Stok";
import { PesananModel } from "./models/Pesanan";
import { StaffModel } from "./models/Staff";

export const app = new Elysia()
  .use(html())
  .use(
    process.env.VERCEL 
      ? (app) => app 
      : staticPlugin({
          assets: 'public', 
          prefix: '/' 
        })
  )

  // Middleware
  .onBeforeHandle(({ cookie: { session }, path }) => {
    const publicPaths = [
      "/", "/menu", "/login", "/auth/login", "/logout", "/auth/logout", "/proses-pesanan"
    ];

    if (path.match(/\.(png|jpg|jpeg|ico|svg)$/i)) return;

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

  //.listen(3000)

//console.log(`🦊 Web Mang Jay berjalan di http://${app.server?.hostname}:${app.server?.port}`);

export default app;