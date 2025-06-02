import { UserModel } from "../../models/user.model";
import { GraphQLContext } from "../context";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config";
import { resolverWrapper } from "../helpers/auth";
import { authService } from "../../services";

export const userResolvers = {
  Query: {
    /**
     * Retorna el usuario autenticado actual.
     */
    me: resolverWrapper(async (_: any, __: any, ctx: GraphQLContext) => {
      return UserModel.findById(ctx.user?.id);
    }, []),
    /**
     * Retorna la lista de todos los usuarios (solo admin).
     */
    users: resolverWrapper(
      async (_: any, __: any) => {
        return UserModel.find();
      },
      ["admin"]
    ),
  },
  Mutation: {
    /**
     * Registra un nuevo usuario y retorna el token JWT y el usuario creado.
     */
    register: resolverWrapper(
      async (_: any, { name, email, password }: any) => {
        const existing = await UserModel.findOne({ email });
        if (existing) throw new Error("Email already in use");
        const hash = await bcrypt.hash(password, 10);
        const user = await UserModel.create({
          name,
          email,
          password: hash,
          authorities: [],
        });

        const { token, user: userCreated } = await authService.login({
          email,
          password,
        });
        return { token, user: { ...userCreated, id: userCreated._id } };
      }
    ),
    /**
     * Inicia sesión y retorna el token JWT y el usuario.
     */
    login: resolverWrapper(async (_: any, { email, password }: any) => {
      const { token, user } = await authService.login({ email, password });
      return { token, user: { ...user, id: user._id } };
    }),
    /**
     * Crea un usuario (solo admin).
     */
    createUser: resolverWrapper(
      async (_: any, { name, email, password, authorities }: any, ctx: GraphQLContext) => {
        const existing = await UserModel.findOne({ email });
        if (existing) throw new Error("Email already in use");
        const hash = await bcrypt.hash(password, 10);
        const user = await UserModel.create({ name, email, password: hash, authorities });
        return { id: user._id, name: user.name, email: user.email, authorities: user.authorities };
      },
      ["admin"]
    ),
    /**
     * Actualiza un usuario (solo admin).
     */
    updateUser: resolverWrapper(
      async (_: any, { id, name, email, password, authorities }: any) => {
        const update: any = {};
        if (name) update.name = name;
        if (email) update.email = email;
        if (password) update.password = await bcrypt.hash(password, 10);
        if (authorities) update.authorities = authorities;
        return UserModel.findByIdAndUpdate(id, update, { new: true });
      },
      ["admin"]
    ),
    /**
     * Elimina un usuario (solo admin).
     */
    deleteUser: resolverWrapper(
      async (_: any, { id }: any) => {
        await UserModel.findByIdAndDelete(id);
        return true;
      },
      ["admin"]
    ),
  },
};
