import { verifyToken } from '../utils/jwt.utils.js';

/**
 * Middleware de autenticação JWT.
 * Extrai o token do header Authorization: Bearer <token>,
 * verifica sua validade e injeta `req.user` com o payload decodificado.
 */
export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      statusCode: 401,
      message: 'Token de autenticação não fornecido.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    return next();
  } catch (_err) {
    return res.status(401).json({
      statusCode: 401,
      message: 'Token inválido ou expirado.',
    });
  }
}
