// Archivo principal de resolvers para Apollo Server.
// Combina resolvers de usuario y post, e incluye resolvers de unión y tipos concretos.
import { userResolvers } from './user';
import { postResolvers } from './post';

export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...postResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
  },
  
  PostResult: postResolvers.PostResult,
  Post: postResolvers.Post,
  Event: postResolvers.Event,
  Offer: postResolvers.Offer,
  News: postResolvers.News,
}; 