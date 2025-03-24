import express, { Express } from "express";
import { authRouter, userRouter, postRouter } from "./routes";
import { errorHandler } from "./middleware";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);

app.use(errorHandler);

export default app;
