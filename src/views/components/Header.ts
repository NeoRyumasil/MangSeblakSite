export const Header = (activePage: "home" | "menu" = "home") => `
  <nav class="bg-white shadow-md fixed w-full z-10 top-0">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex justify-between items-center py-4">
          <a href="/" class="text-2xl font-bold text-red-600 hover:text-red-700 transition">
            🍜 Seblak Korea Mang Jay
          </a>
          <div class="hidden md:flex space-x-6">
            <a href="/" class="${activePage === "home" ? "text-red-600 font-bold" : "hover:text-red-500 font-medium"} transition">Tentang</a>
            <a href="/menu" class="${activePage === "menu" ? "text-red-600 font-bold" : "hover:text-red-500 font-medium"} transition">Menu</a>
          </div>
        </div>
      </div>
    </nav>
`;