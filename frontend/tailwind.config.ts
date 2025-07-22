import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

const config: Config = {
  // Quais arquivos o Tailwind deve vasculhar para gerar as classes
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/features/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Paleta de cores neon e identidade escura
      colors: {
        'tron-cyan': '#51BEDB',
        'tron-green': '#61CC2E',
        'tron-purple': '#663294',
        'bg-dark': '#141825',
        'text-primary': '#FFFFFF',
      },
      // Fontes: display para títulos e sans para corpo
      fontFamily: {
        display: ['Rajdhani', ...defaultTheme.fontFamily.sans],
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      // Sombreamentos “glow” para efeitos neon
      boxShadow: {
        'glow-cyan': '0 0 8px rgba(81, 190, 219, 0.8)',
        'glow-green': '0 0 8px rgba(97, 204, 46, 0.8)',
        'glow-purple': '0 0 8px rgba(102, 50, 148, 0.8)',
      },
      // Espaçamentos adicionais, se necessário
      // spacing: {
      //   '18': '4.5rem',
      //   '22': '5.5rem',
      // },
    },
  },
  plugins: [
    // Formulários estilizados
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}

export default config
