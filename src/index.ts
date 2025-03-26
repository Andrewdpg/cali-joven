import app from "./app";
import { env } from "./config";
import { db } from "./lib/conectionDb";

db.then(() => {
  app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
  });
});

export default app;