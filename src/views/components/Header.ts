export const Header = () => `
  <nav class="bg-white shadow-md fixed w-full z-10 top-0">
    <div class="max-w-6xl mx-auto px-4">
      <div class="flex justify-between items-center py-4">
        <a href="/" class="text-2xl font-bold text-red-600 hover:text-red-700 transition">
          🍜 Mang Jay
        </a>
        <div class="hidden md:flex space-x-6">
          <a href="/#tentang" class="hover:text-red-500 font-medium transition">Tentang</a>
          <a href="/menu" class="hover:text-red-500 font-medium transition">Menu</a>
        </div>
        <div>
          <a href="/menu" class="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full font-semibold transition shadow-lg">
            Pesan Sekarang
          </a>
        </div>
      </div>
    </div>
  </nav>
`;