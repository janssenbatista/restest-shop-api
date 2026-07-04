import { ZodError } from 'zod';

/**
 * Middleware global de tratamento de erros.
 * Deve ser registrado APÓS todas as rotas no app.js.
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, res, _next) {
  // Erros de validação Zod
  if (err instanceof ZodError) {
    return res.status(422).json({
      statusCode: 422,
      message: 'Erro de validação.',
      errors: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  // Erros conhecidos lançados pelos services
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
    });
  }

  // Erro interno inesperado
  console.error('[ERROR]', err);
  return res.status(500).json({
    statusCode: 500,
    message: 'Erro interno do servidor.',
  });
}

/**
 * Cria um erro com statusCode para ser lançado nos services.
 * @param {number} statusCode
 * @param {string} message
 */
export function createError(statusCode, message) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}
