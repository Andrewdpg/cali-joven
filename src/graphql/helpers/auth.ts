import { GraphQLContext } from "../context";
import { UserModel } from "../../models/user.model";

/**
 * Verifica si el usuario tiene una de las autorizaciones requeridas.
 */
const hasAuthority = (required: string[], authorities: string[]) =>
  required.some((a) => authorities.includes(a));

/**
 * Verifica si el usuario está autenticado.
 */
export function requireAuth(ctx: any) {
  if (!ctx.user?.id) {
    throw new Error("Not authenticated");
  }
}

/**
 * Wrapper para resolver de Apollo Server.
 * Verifica si el usuario tiene las autorizaciones requeridas y valida los datos de entrada.
 */
export function resolverWrapper(
  resolver: any,
  authorities: string[] | null = null,
  validator: any | null = null
) {
  return async (parent: any, args: any, ctx: GraphQLContext) => {
    if (authorities) {
      requireAuth(ctx);

      if (authorities.length > 0) {
        if (!hasAuthority(authorities, ctx.user?.authorities!)) {
          throw new Error("Not authorized");
        }
      }
    }

    if (validator) validator(args);

    return resolver(parent, args, ctx);
  };
}
