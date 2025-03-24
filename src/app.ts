import express, { Express } from "express";
import { authRouter, userRouter, postRouter } from "./routes";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);

export default app;
