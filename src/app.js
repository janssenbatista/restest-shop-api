import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { swaggerSpec } from './config/swagger.js';
import { errorHandler } from './middlewares/error.middleware.js';
import authRoutes from './modules/auth/auth.routes.js';
import productsRoutes from './modules/products/products.routes.js';

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
        .split(',')
        .map((o) => o.trim())
        .filter(Boolean);

      // Permitir requisições sem origin (ex: Insomnia, curl) ou origins autorizadas
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} não autorizada pelo CORS.`));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Restest API Docs',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
    },
  }),
);

app.get('/api/docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

/**
 * @openapi
 * /health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Status da API
 *     description: Verifica se a API está online e retorna o timestamp atual.
 *     responses:
 *       200:
 *         description: API funcionando normalmente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 app:
 *                   type: string
 *                   example: Restest API
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    app: 'Restest API',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);

app.use((_req, res) => {
  res.status(404).json({
    statusCode: 404,
    message: 'Rota não encontrada.',
  });
});

app.use(errorHandler);

export default app;
