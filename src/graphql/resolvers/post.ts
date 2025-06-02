import { postService } from "../../services/post.service";
import { UserModel } from "../../models/user.model";
import { GraphQLContext } from "../context";
import { resolverWrapper } from "../helpers/auth";
import { CreatePostSchema, UpdatePostSchema } from "../../schemas";

export const postResolvers = {
  Query: {
    /**
     * Obtiene todos los posts, con opción de filtrar por tipo o usuario.
     * Solo usuarios autenticados pueden acceder.
     */
    posts: resolverWrapper(
      async (_: any, args: { type?: string; userId?: string }) => {
        let posts = await postService.getAll();

        if (args.type) posts = posts.filter((p) => p.type === args.type);
        if (args.userId)
          posts = posts.filter(
            (p) => p.published_by.toString() === args.userId
          );

        return posts
      }
    ),
    /**
     * Obtiene un post por su ID.
     * Solo usuarios autenticados pueden acceder.
     */
    post: resolverWrapper(
      async (_: any, args: { id: string }, ctx: GraphQLContext) => {
        return await postService.getById(args.id);
      }
    ),
  },
  Mutation: {
    /**
     * Crea un evento. Valida autenticación y usa el servicio de posts.
     */
    createEvent: resolverWrapper(
      async (_: any, input: any, ctx: GraphQLContext) => {
        const event = { ...input, type: "event", published_by: ctx.user?.id };
        return await postService.create(event, ctx.user?.id!);
      },
      ["admin"],
      CreatePostSchema.parse
    ),
    /**
     * Crea una oferta. Valida autenticación y usa el servicio de posts.
     */
    createOffer: resolverWrapper(
      async (_: any, input: any, ctx: GraphQLContext) => {
        const offer = { ...input, type: "offer", published_by: ctx.user?.id };
        return await postService.create(offer, ctx.user?.id!);
      },
      ["admin"],
      CreatePostSchema.parse
    ),
    /**
     * Crea una noticia. Valida autenticación y usa el servicio de posts.
     */
    createNews: resolverWrapper(
      async (_: any, input: any, ctx: GraphQLContext) => {
        const news = { ...input, type: "news", published_by: ctx.user?.id };
        return await postService.create(news, ctx.user?.id!);
      },
      ["admin"],
      CreatePostSchema.parse
    ),
    /**
     * Actualiza un post. Solo el autor o un admin pueden modificar.
     */
    updatePost: resolverWrapper(
      async (_: any, { id, data }: any, ctx: GraphQLContext) => {
        return await postService.update(id, data);
      },
      ["admin"],
      UpdatePostSchema.parse
    ),
    /**
     * Elimina un post. Solo el autor o un admin pueden eliminar.
     */
    deletePost: resolverWrapper(
      async (_: any, { id }: any, ctx: GraphQLContext) => {
        await postService.delete(id);
        return true;
      },
      ["admin"]
    ),
  },
  /**
   * Resolver para la unión PostResult, determina el tipo concreto.
   */
  PostResult: {
    __resolveType(obj: any) {
      if (obj.type === "event") return "Event";
      if (obj.type === "offer") return "Offer";
      if (obj.type === "news") return "News";
      return null;
    },
  },
  /**
   * Resolver para la interfaz Post, determina el tipo concreto.
   */
  Post: {
    __resolveType(obj: any) {
      if (obj.type === "event") return "Event";
      if (obj.type === "offer") return "Offer";
      if (obj.type === "news") return "News";
      return null;
    },
  },
  /**
   * Resolver de campo para Event: resuelve el usuario que publicó el evento.
   */
  Event: {
    published_by: async (parent: any) =>
      UserModel.findById(parent.published_by),
  },
  /**
   * Resolver de campo para Offer: resuelve el usuario que publicó la oferta.
   */
  Offer: {
    published_by: async (parent: any) =>
      UserModel.findById(parent.published_by),
  },
  /**
   * Resolver de campo para News: resuelve el usuario que publicó la noticia.
   */
  News: {
    published_by: async (parent: any) =>
      UserModel.findById(parent.published_by),
  },
};
