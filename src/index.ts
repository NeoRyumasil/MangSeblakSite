import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import { LandingView } from "./views/LandingPage"; // <-- Import View Landing Page

const app = new Elysia()
  .use(html())
  
  // Route Utama: Menampilkan Landing Page Seblak Korea
  .get("/", () => LandingView.HalamanUtama())

  .listen(3000);

console.log(`🦊 Web Mang Jay berjalan di http://${app.server?.hostname}:${app.server?.port}`);