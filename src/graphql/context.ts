import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config';
import { User } from '../types/user.types';

/**
 * Contexto de Apollo Server para GraphQL.
 * Extrae el usuario autenticado desde el JWT en el header Authorization.
 */
export interface GraphQLContext {
  user?: Partial<User> & { id?: string };
}

export const context = async ({ req }: { req: Request }): Promise<GraphQLContext> => {
  const auth = req.headers.authorization || '';
  if (auth.startsWith('Bearer ')) {
    const token = auth.replace('Bearer ', '');
    try {
      const payload = jwt.verify(token, env.JWT_SECRET) as { user_id: string, authorities: string[] };
      return { user: { id: payload.user_id, authorities: payload.authorities } };
    } catch (e) {
      return {};
    }
  }
  return {};
}; 