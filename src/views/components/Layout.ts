import { Header } from "./Header";
import { Footer } from "./Footer";

export const Layout = (title: string, content: string) => `
  <!DOCTYPE html>
  <html lang="id">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/htmx.org@1.9.11"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              spicy: { 500: '#ef4444', 600: '#dc2626', 900: '#7f1d1d' },
              korean: '#facc15'
            }
          }
        }
      }
    </script>
  </head>
  <body class="bg-orange-50 text-gray-800 font-sans antialiased min-h-screen flex flex-col pt-20">
    ${Header()}

    <main class="flex-grow">
      ${content}
    </main>

    ${Footer()}
  </body>
  </html>
`;