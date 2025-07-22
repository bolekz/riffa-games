import { test, expect } from '@playwright/test';

// Descreve o conjunto de testes para a "Autenticação"
test.describe('Fluxo de Autenticação', () => {

  // O primeiro teste: Login com sucesso
  test('deve permitir que um usuário faça login com sucesso e o redirecione para a página de perfil', async ({ page }) => {
    
    // --- 1. Preparação (Arrange) ---
    // Navega para a página de login antes de cada teste
    await page.goto('http://localhost:3000/auth/login');

    // --- 2. Ação (Act) ---
    // Encontra o campo de email pelo seu 'label' e o preenche
    await page.getByLabel('Email').fill('usuario@exemplo.com');

    // Encontra o campo de senha pelo seu 'label' e o preenche
    await page.getByLabel('Senha').fill('senhaForte123');

    // Encontra o botão "Entrar" pelo seu texto e clica nele
    await page.getByRole('button', { name: 'Entrar' }).click();

    // --- 3. Verificação (Assert) ---
    // Espera a URL mudar para a página de perfil
    await expect(page).toHaveURL('http://localhost:3000/me');

    // Verifica se um elemento específico da página de perfil está visível,
    // confirmando que o login foi bem-sucedido e a página carregou.
    // Usamos uma expressão regular (RegExp) para ignorar o nome exato.
    await expect(page.getByText(/Bem-vindo de volta/)).toBeVisible();
  });

  // Você pode adicionar outros testes aqui, como:
  test('deve mostrar uma mensagem de erro para credenciais inválidas', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login');
    
    await page.getByLabel('Email').fill('usuario@errado.com');
    await page.getByLabel('Senha').fill('senhaErrada');
    await page.getByRole('button', { name: 'Entrar' }).click();

    // Verifica se a mensagem de erro específica aparece na tela
    await expect(page.getByText(/E-mail ou senha inválidos/)).toBeVisible();

    // E verifica se a URL NÃO mudou
    await expect(page).toHaveURL('http://localhost:3000/auth/login');
  });

});