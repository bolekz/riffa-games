/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    // --- ATUALIZAÇÃO AQUI ---
    // Adicionamos o autoprefixer, que é essencial para o Tailwind funcionar com o Next.js
    autoprefixer: {},
  },
};

export default config;