import { db } from "./lib/conectionDb";
import { env } from "./config";
import app from "./app";

db.then(() => {
  app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
  });
});
