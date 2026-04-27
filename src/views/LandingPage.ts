export const LandingView = {
  HalamanUtama: () => `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Seblak Korea Mang Jay</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <script src="https://unpkg.com/htmx.org@1.9.11"></script>
      <script>
        // Konfigurasi warna kustom Tailwind untuk tema pedas
        tailwind.config = {
          theme: {
            extend: {
              colors: {
                spicy: {
                  500: '#ef4444', // Merah cabai
                  600: '#dc2626', // Merah gelap
                  900: '#7f1d1d', // Merah kehitaman
                },
                korean: '#facc15' // Kuning keju/telur
              }
            }
          }
        }
      </script>
    </head>
    <body class="bg-orange-50 text-gray-800 font-sans antialiased">

      <nav class="bg-white shadow-md fixed w-full z-10 top-0">
        <div class="max-w-6xl mx-auto px-4">
          <div class="flex justify-between items-center py-4">
            <div class="text-2xl font-bold text-spicy-600">
              🍜 Mang Jay
            </div>
            <div class="hidden md:flex space-x-6">
              <a href="#tentang" class="hover:text-spicy-500 font-medium transition">Tentang</a>
              <a href="#menu" class="hover:text-spicy-500 font-medium transition">Menu Unggulan</a>
            </div>
            <div>
              <a href="/kasir" class="bg-spicy-500 hover:bg-spicy-600 text-white px-5 py-2 rounded-full font-semibold transition shadow-lg">
                Pesan Sekarang
              </a>
            </div>
          </div>
        </div>
      </nav>

      <section class="pt-32 pb-20 px-4">
        <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center text-center md:text-left">
          <div class="md:w-1/2 mb-10 md:mb-0">
            <span class="bg-korean text-spicy-900 px-3 py-1 rounded-full text-sm font-bold tracking-wide uppercase">
              Pertama di Kota Ini!
            </span>
            <h1 class="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mt-4 mb-6">
              Sensasi <span class="text-spicy-600">Pedas Sunda</span> Bertemu <span class="text-spicy-600">Gochujang Korea</span>
            </h1>
            <p class="text-lg text-gray-600 mb-8">
              Lupakan seblak biasa. Nikmati kenyalnya kerupuk seblak berpadu dengan tteokbokki, odeng, dan kuah gochujang kental yang bikin keringetan tapi nagih!
            </p>
            <div class="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <a href="/kasir" class="bg-spicy-600 hover:bg-spicy-500 text-white px-8 py-3 rounded-full font-bold text-lg transition shadow-xl transform hover:-translate-y-1">
                Order via Kasir &rarr;
              </a>
              <a href="#menu" class="bg-white border-2 border-spicy-200 text-spicy-600 hover:bg-spicy-50 px-8 py-3 rounded-full font-bold text-lg transition">
                Lihat Menu
              </a>
            </div>
          </div>
          
          <div class="md:w-1/2 flex justify-center">
            <div class="w-72 h-72 md:w-96 md:h-96 bg-spicy-100 rounded-full flex items-center justify-center relative shadow-2xl border-4 border-white">
               <span class="text-9xl">🍲🔥</span>
               <div class="absolute -bottom-4 -right-4 bg-white p-3 rounded-xl shadow-lg border border-gray-100">
                 <p class="font-bold text-spicy-600">⭐ 4.9/5</p>
                 <p class="text-xs text-gray-500">Review Pelanggan</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      <section id="tentang" class="bg-white py-16 px-4">
        <div class="max-w-6xl mx-auto text-center">
          <h2 class="text-3xl font-bold mb-12">Kenapa Harus Seblak Mang Jay?</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div class="p-6 bg-orange-50 rounded-2xl">
              <div class="text-4xl mb-4">🇰🇷</div>
              <h3 class="text-xl font-bold mb-2">Bumbu Import Korea</h3>
              <p class="text-gray-600">Gochujang dan gochugaru asli yang dicampur dengan kencur khas Sunda. Rasanya umami maksimal!</p>
            </div>

            <div class="p-6 bg-orange-50 rounded-2xl">
              <div class="text-4xl mb-4">🍢</div>
              <h3 class="text-xl font-bold mb-2">Topping Premium</h3>
              <p class="text-gray-600">Selain kerupuk dan makaroni, nikmati topping tteokbokki, fishcake (odeng), sosis, dan mozarella.</p>
            </div>

            <div class="p-6 bg-orange-50 rounded-2xl">
              <div class="text-4xl mb-4">🌶️</div>
              <h3 class="text-xl font-bold mb-2">Level Pedas Bebas</h3>
              <p class="text-gray-600">Dari level 0 (Aman di perut) sampai level 5 (Meledak di mulut). Kamu yang tentukan sendiri nyalimu!</p>
            </div>

          </div>
        </div>
      </section>

      <footer class="bg-gray-900 text-white py-8 text-center">
        <p class="text-gray-400">© 2026 Seblak Korea Mang Jay. Dibangun dengan BETH Stack.</p>
      </footer>

    </body>
    </html>
  `
};