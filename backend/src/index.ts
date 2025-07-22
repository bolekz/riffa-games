// src/index.ts

require('dotenv').config();
const { startServer } = require('./server');

// Só executa se não for importado (ex: para teste)
if (require.main === module) {
  startServer();
}
