// /src/types/express/index.d.ts

// Este arquivo estende a interface Request do Express para adicionar nossas propriedades customizadas.
declare namespace Express {
  export interface Request {
    // Propriedade para carregar os dados do usuário autenticado
    user?: {
      id: string;
      role: string;
    };
    // Função adicionada pelo middleware 'csurf' para gerar tokens CSRF
    csrfToken: () => string;
  }
}