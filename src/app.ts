import express, { Express } from "express";
import {
  authRouter,
  userRouter,
  postRouter,
  organizationRouter,
} from "./routes";
import { errorHandler } from "./middleware";
import { wrapBody } from "./middleware/bodyWrap.middleware";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";
import { context } from "./graphql/context";
import { formatGraphQLError } from './graphql/helpers/errorFormatter';

const app = express();

// Apollo Server setup
async function setupApollo(app: Express) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
    formatError: formatGraphQLError,
  });
  await server.start();
  server.applyMiddleware({ app: app as any, path: "/graphql" });
}
setupApollo(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", wrapBody, userRouter);
app.use("/api/auth", wrapBody, authRouter);
app.use("/api/post", wrapBody, postRouter);
app.use("/api/organization", wrapBody, organizationRouter);

app.use(errorHandler);

export default app;
