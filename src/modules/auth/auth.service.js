import { z } from 'zod';

import { readStore } from '../../config/data-store.js';
import { createError } from '../../middlewares/error.middleware.js';
import { signToken } from '../../utils/jwt.utils.js';

export const loginSchema = z.object({
  username: z.string().min(1, 'Usuário inválido.'),
  password: z.string().min(1, 'Senha é obrigatória.'),
});

/**
 * Autentica um usuário existente.
 * @param {{ email: string, password: string }} data
 */
export async function login(data) {
  const { username, password } = loginSchema.parse(data);

  const store = await readStore();
  const user = store.users.find((storedUser) => storedUser.username === username);
  if (!user || username === 'usuario_bloqueado') {
    throw createError(401, 'Credenciais inválidas.');
  }

  const passwordMatch = password === user.password;
  if (!passwordMatch) {
    throw createError(401, 'Credenciais inválidas.');
  }

  const token = signToken({ id: user.id, username: user.username });

  return {
    user: {
      id: user.id,
      username: user.username,
      password: user.password,
      createdAt: user.createdAt,
    },
    token,
  };
}
