export const LoginView = {
  HalamanLogin: (error?: string) => `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Login Admin — Mang Jay</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; }
        body { font-family: 'DM Sans', sans-serif; }
        h1, h2, .font-display { font-family: 'Syne', sans-serif; }

        /* Animated background blobs */
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.35;
          animation: float 8s ease-in-out infinite;
        }
        .blob-1 { width: 420px; height: 420px; background: #ef4444; top: -100px; left: -100px; animation-delay: 0s; }
        .blob-2 { width: 300px; height: 300px; background: #f97316; bottom: -80px; right: -60px; animation-delay: -3s; }
        .blob-3 { width: 200px; height: 200px; background: #facc15; top: 40%; left: 30%; animation-delay: -5s; }

        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }

        /* Card slide-up animation */
        .card-enter {
          animation: slideUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Input focus glow */
        .input-field {
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-field:focus {
          outline: none;
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
        }

        /* Button press */
        .btn-login {
          transition: transform 0.1s, box-shadow 0.2s;
        }
        .btn-login:hover {
          box-shadow: 0 8px 24px rgba(220, 38, 38, 0.4);
          transform: translateY(-1px);
        }
        .btn-login:active {
          transform: translateY(1px) scale(0.99);
          box-shadow: none;
        }

        /* Floating food emojis */
        .emoji-float {
          position: absolute;
          font-size: 2rem;
          animation: emojiDrift linear infinite;
          opacity: 0.12;
          pointer-events: none;
          user-select: none;
        }
        @keyframes emojiDrift {
          0%   { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10%  { opacity: 0.12; }
          90%  { opacity: 0.12; }
          100% { transform: translateY(-120px) rotate(360deg); opacity: 0; }
        }

        /* Shake animation for error */
        .shake {
          animation: shake 0.4s ease;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      </style>
    </head>
    <body class="min-h-screen flex items-center justify-center overflow-hidden bg-gray-950 relative">

      <!-- Animated background blobs -->
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>

      <!-- Floating emoji background -->
      <span class="emoji-float" style="left:5%;  animation-duration:14s; animation-delay:0s;">🍜</span>
      <span class="emoji-float" style="left:18%; animation-duration:18s; animation-delay:-4s;">🌶️</span>
      <span class="emoji-float" style="left:35%; animation-duration:12s; animation-delay:-8s;">🍲</span>
      <span class="emoji-float" style="left:55%; animation-duration:16s; animation-delay:-2s;">🔥</span>
      <span class="emoji-float" style="left:72%; animation-duration:20s; animation-delay:-6s;">🍜</span>
      <span class="emoji-float" style="left:88%; animation-duration:13s; animation-delay:-10s;">🌶️</span>

      <!-- Login Card -->
      <div class="card-enter relative z-10 w-full max-w-md mx-4">

        <!-- Glassmorphism card -->
        <div class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">

          <!-- Brand -->
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-red-500 rounded-2xl shadow-lg shadow-red-500/40 mb-4 text-3xl rotate-3">
              🍜
            </div>
            <h1 class="font-display text-3xl font-extrabold text-white tracking-tight">Mang Jay</h1>
            <p class="text-white/50 text-sm mt-1 font-medium">Panel Admin — Masuk untuk melanjutkan</p>
          </div>

          <!-- Error Banner -->
          ${error ? `
          <div id="error-banner" class="shake bg-red-500/20 border border-red-500/40 text-red-300 rounded-xl px-4 py-3 mb-6 text-sm font-medium flex items-center gap-2">
            <span>⚠️</span> ${error}
          </div>
          ` : ''}

          <!-- Form -->
          <form method="POST" action="/auth/login" class="space-y-5">

            <div>
              <label class="block text-white/70 text-xs font-semibold uppercase tracking-widest mb-2">Username</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-lg">👤</span>
                <input
                  type="text"
                  name="username"
                  placeholder="Masukkan username"
                  required
                  autocomplete="username"
                  class="input-field w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl pl-11 pr-4 py-3.5 text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label class="block text-white/70 text-xs font-semibold uppercase tracking-widest mb-2">Password</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-lg">🔒</span>
                <input
                  type="password"
                  name="password"
                  id="password-input"
                  placeholder="Masukkan password"
                  required
                  autocomplete="current-password"
                  class="input-field w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl pl-11 pr-12 py-3.5 text-sm font-medium"
                />
                <!-- Toggle password visibility -->
                <button
                  type="button"
                  onclick="togglePassword()"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition text-sm"
                  id="toggle-btn"
                >
                  👁️
                </button>
              </div>
            </div>

            <button
              type="submit"
              class="btn-login w-full bg-red-600 hover:bg-red-500 text-white font-display font-bold text-base py-3.5 rounded-xl mt-2 shadow-lg shadow-red-600/30"
            >
              Masuk ke Dashboard →
            </button>

          </form>

          <!-- Divider -->
          <div class="mt-8 pt-6 border-t border-white/10 text-center">
            <p class="text-white/30 text-xs">
              © 2026 Seblak Korea Mang Jay &nbsp;·&nbsp; Hanya untuk admin
            </p>
          </div>

        </div>

        <!-- Back to home -->
        <div class="text-center mt-5">
          <a href="/" class="text-white/40 hover:text-white/70 text-sm transition font-medium">
            ← Kembali ke halaman utama
          </a>
        </div>

      </div>

      <script>
        function togglePassword() {
          const input = document.getElementById('password-input');
          const btn = document.getElementById('toggle-btn');
          if (input.type === 'password') {
            input.type = 'text';
            btn.textContent = '🙈';
          } else {
            input.type = 'password';
            btn.textContent = '👁️';
          }
        }
      </script>

    </body>
    </html>
  `
};