import { defineConfig, devices } from '@playwright/test';
import type { PlaywrightTestConfig } from '@playwright/test';

/**
 * Leia mais sobre como configurar o Playwright aqui: https://playwright.dev/docs/test-configuration
 */
const config: PlaywrightTestConfig = {
  testDir: './tests',
  /* Tempo máximo que um teste pode rodar. */
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  // --- CORREÇÃO AQUI ---
  // Unificamos as configurações da propriedade 'use' em um único bloco.
  use: {
    /* Define a URL base para que os testes não precisem do endereço completo. */
    baseURL: 'http://127.0.0.1:3000',

    /* Coleta o 'trace' quando um teste falha na primeira tentativa. */
    trace: 'on-first-retry',
  },

  /* Inicia o servidor de desenvolvimento automaticamente antes dos testes */
  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
  },

  /* Configuração para os diferentes navegadores */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
};

export default config;