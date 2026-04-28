import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import { LandingView } from "./views/LandingPage"; 
import { MenuView } from "./views/Menu";

const app = new Elysia()
  .use(html())
  
  .get("/", () => LandingView.HalamanUtama())
  .get("/menu", () => MenuView.HalamanMenu([]))

  .listen(3000);

console.log(`🦊 Web Mang Jay berjalan di http://${app.server?.hostname}:${app.server?.port}`);