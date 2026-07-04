import * as authService from './auth.service.js';

/**
 * POST /api/auth/login
 */
export async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    return res.status(200).json({
      message: 'Login realizado com sucesso.',
      ...result,
    });
  } catch (err) {
    return next(err);
  }
}
