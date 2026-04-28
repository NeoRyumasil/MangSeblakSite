import { Layout } from "./components/Layout";

export const LandingView = {
  HalamanUtama: () => {
 
    const content = `
      <section class="pt-12 pb-20 px-4">
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
              <a href="/menu" class="bg-spicy-600 hover:bg-spicy-500 text-white px-8 py-3 rounded-full font-bold text-lg transition shadow-xl">
                Order Sekarang &rarr;
              </a>
            </div>
          </div>
          
          <div class="md:w-1/2 flex justify-center">
            <div class="w-72 h-72 md:w-96 md:h-96 bg-spicy-100 rounded-full flex items-center justify-center relative shadow-2xl border-4 border-white">
               <span class="text-9xl">🍲🔥</span>
            </div>
          </div>
        </div>
      </section>

      <section id="tentang" class="bg-white py-16 px-4 rounded-t-[3rem]">
        <div class="max-w-6xl mx-auto text-center">
          <h2 class="text-3xl font-bold mb-12">Kenapa Harus Seblak Mang Jay?</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="p-6 bg-orange-50 rounded-2xl">
              <div class="text-4xl mb-4">🇰🇷</div>
              <h3 class="text-xl font-bold mb-2">Bumbu Import</h3>
              <p class="text-gray-600">Gochujang dan gochugaru asli dicampur kencur khas Sunda.</p>
            </div>
            <div class="p-6 bg-orange-50 rounded-2xl">
              <div class="text-4xl mb-4">🍢</div>
              <h3 class="text-xl font-bold mb-2">Topping Premium</h3>
              <p class="text-gray-600">Tteokbokki, fishcake (odeng), sosis, dan mozarella.</p>
            </div>
            <div class="p-6 bg-orange-50 rounded-2xl">
              <div class="text-4xl mb-4">🌶️</div>
              <h3 class="text-xl font-bold mb-2">Level Pedas Bebas</h3>
              <p class="text-gray-600">Dari level 0 sampai 5. Tentukan sendiri nyalimu!</p>
            </div>
          </div>
        </div>
      </section>
    `;

    // 2. Kembalikan fungsi Layout dengan membawa Judul dan Konten
    return Layout("Seblak Korea Mang Jay - Beranda", content);
  }
};