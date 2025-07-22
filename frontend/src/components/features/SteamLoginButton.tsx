// src/components/features/SteamLoginButton.tsx
'use client';

const STEAM_AUTH_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'}/auth/steam`;

export function SteamLoginButton() {
  return (
    <a
      href={STEAM_AUTH_URL}
      className="group inline-flex w-full items-center justify-center gap-3 rounded-md border border-gray-700 bg-gray-800/30 px-5 py-3 text-text-primary transition-all duration-300 hover:border-tron-cyan hover:bg-gray-800"
    >
      <svg
        className="h-6 w-6 text-gray-300 transition-colors group-hover:text-white"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M8.89 10.27a2.22 2.22 0 1 0 2.22 2.22 2.22 2.22 0 0 0-2.22-2.22Zm0 3.2a.98.98 0 1 1 0-1.95.98.98 0 0 1 0 1.95ZM20.38 3H3.62A.63.63 0 0 0 3 3.62v16.76c0 .34.28.62.62.62h16.76a.63.63 0 0 0 .62-.62V3.62a.63.63 0 0 0-.62-.62ZM19 15.9a3.22 3.22 0 0 1-2.76 3.18 3.2 3.2 0 0 1-3.52-2.83L8.45 14a3.2 3.2 0 0 1-2.44-3.03 3.2 3.2 0 0 1 6.4-.5l4.18 2.42a3.2 3.2 0 0 1 2.4 3Zm-3.22-.98a.98.98 0 1 1 0-1.95.98.98 0 0 1 0 1.95Z"/>
      </svg>
      <span className="text-sm font-semibold">Continuar com a Steam</span>
    </a>
  );
}
