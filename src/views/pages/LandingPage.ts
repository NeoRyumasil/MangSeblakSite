import { Layout } from "../components/Layout";

export const LandingView = {
  HalamanUtama: () => {
 
    const content = `
      <section class="pt-8 md:pt-12 pb-16 md:pb-20 px-4">
        <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center text-center md:text-left">
          <div class="w-full md:w-1/2 mb-10 md:mb-0">
            <span class="bg-korean text-spicy-900 px-3 py-1.5 rounded-full text-xs md:text-sm font-bold tracking-wide uppercase">
              Pertama di Kota Ini!
            </span>
            <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mt-5 mb-4 md:mb-6">
              Sensasi <span class="text-spicy-600">Pedas Sunda</span> Bertemu <span class="text-spicy-600">Gochujang Korea</span>
            </h1>
            <p class="text-base sm:text-lg text-gray-600 mb-8 px-2 md:px-0">
              Lupakan seblak biasa. Nikmati kenyalnya kerupuk seblak berpadu dengan tteokbokki, odeng, dan kuah gochujang kental yang bikin keringetan tapi nagih!
            </p>
            <div class="flex flex-col sm:flex-row justify-center md:justify-start space-y-3 sm:space-y-0 sm:space-x-4 px-4 md:px-0">
              <a href="/menu" class="w-full sm:w-auto text-center bg-spicy-600 hover:bg-spicy-500 text-white px-8 py-3.5 rounded-full font-bold text-lg transition shadow-xl">
                Order Sekarang &rarr;
              </a>
            </div>
          </div>
          
          <div class="w-full md:w-1/2 flex justify-center mt-4 md:mt-0">
            <div class="w-64 h-64 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-spicy-100 rounded-full flex items-center justify-center relative shadow-2xl border-4 border-white">
               <span class="text-8xl md:text-9xl">🍜🔥</span>
            </div>
          </div>
        </div>
      </section>

      <section id="tentang" class="bg-white py-12 md:py-16 px-4 rounded-t-[2rem] md:rounded-t-[3rem]">
        <div class="max-w-6xl mx-auto text-center">
          <h2 class="text-2xl md:text-3xl font-bold mb-8 md:mb-12 px-4">Kenapa Harus Seblak Mang Jay?</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <div class="p-6 bg-orange-50 rounded-2xl hover:shadow-lg transition hover:scale-105">
              <div class="text-4xl mb-3">🌶️</div>
              <h3 class="text-lg md:text-xl font-bold mb-2">Bumbu Import</h3>
              <p class="text-sm md:text-base text-gray-600">Gochujang dan gochugaru asli dicampur kencur khas Sunda.</p>
            </div>
            <div class="p-6 bg-orange-50 rounded-2xl hover:shadow-lg transition hover:scale-105">
              <div class="text-4xl mb-3">🍢</div>
              <h3 class="text-lg md:text-xl font-bold mb-2">Topping Premium</h3>
              <p class="text-sm md:text-base text-gray-600">Tteokbokki, fishcake (odeng), sosis, dan mozarella.</p>
            </div>
            <div class="p-6 bg-orange-50 rounded-2xl hover:shadow-lg transition hover:scale-105">
              <div class="text-4xl mb-3">🔥🥵</div>
              <h3 class="text-lg md:text-xl font-bold mb-2">Level Pedas Bebas</h3>
              <p class="text-sm md:text-base text-gray-600">Dari level 0 sampai 5. Tentukan sendiri nyalimu!</p>
            </div>
          </div>
        </div>
      </section>
    `;

    return Layout("Seblak Korea Mang Jay - Beranda", content);
  }
};