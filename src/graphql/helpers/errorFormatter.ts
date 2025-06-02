import { GraphQLError } from "graphql";
import { ZodError } from "zod";

/**
 * Formatea los errores de Apollo Server para ocultar el stacktrace y mostrar errores de Zod de forma legible.
 */
export function formatGraphQLError(error: GraphQLError) {
  // Si es un error de Zod
  if (error.originalError instanceof ZodError) {
    return {
      message: "Validation error",
      details: error.originalError.errors.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      })),
      locations: error.locations,
      path: error.path,
      extensions: {
        code: "BAD_USER_INPUT",
      },
    };
  }
  // Otros errores: no mostrar stacktrace
  return {
    message: error.message,
    locations: error.locations,
    path: error.path,
    extensions: {
      code: error.extensions?.code || "INTERNAL_SERVER_ERROR",
    },
  };
}
