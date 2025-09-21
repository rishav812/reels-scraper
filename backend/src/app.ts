import express from "express";
import { SERVER_PORT } from "./config/constants";
import routes from "./routes";
import { browserService } from "./services/browser";


const app = express();


app.use(express.json());


app.use(routes);


app.listen(SERVER_PORT, () => {
  console.log(`Server started on port ${SERVER_PORT}`);
});

process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await browserService.close();
  process.exit(0);
});

export default app;
