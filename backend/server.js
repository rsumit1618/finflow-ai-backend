import dotenv from "dotenv";
import app from "./src/app.js";
import { env } from "./src/config/env.js";


app.listen(env.port, () => {
  console.log(
    `FinFlow AI server running on http://localhost:${env.port} in ${env.nodeEnv} mode`
  );
});