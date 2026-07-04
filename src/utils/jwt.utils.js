import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';

/**
 * Gera um JWT para o usuário informado.
 * @param {Object} payload - Dados a incluir no token (ex: { id, username })
 * @returns {string} Token JWT assinado
 */
export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verifica e decodifica um JWT.
 * @param {string} token - Token JWT a verificar
 * @returns {Object} Payload decodificado
 * @throws {Error} Se o token for inválido ou expirado
 */
export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
