import 'dotenv/config';

import app from './src/app.js';

const PORT = process.env.PORT || 3000;
const API_URL = process.env.API_URL || 'http://localhost';

app.listen(PORT, () => {
  console.info(`🚀 Restest API rodando em ${API_URL}:${PORT}`);
  console.info(`✅ Health check: ${API_URL}:${PORT}/health`);
  console.info(`📋 Documentation: ${API_URL}:${PORT}/api/docs`);
  console.info(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});
