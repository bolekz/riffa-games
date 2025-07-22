import React from 'react';

// Este layout será aplicado a todas as páginas dentro do grupo (marketing)
// como a Home, /about, /faq, etc.
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ele não precisa de lógica de proteção, apenas renderiza o conteúdo.
  // O Header e o Footer já estão no layout raiz (RootLayout),
  // então este arquivo pode ser bem simples ou até conter um wrapper específico.
  return (
    <>
      {children}
    </>
  );
}