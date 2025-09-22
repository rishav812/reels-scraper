import express from "express";
import { SERVER_PORT } from "./config/constants";
import routes from "./routes";
import { browserService } from "./services/browser";

const app = express();

// This tells Express to trust Render/Heroku/Nginx proxy headers
app.set("trust proxy", 1);

app.use(express.json());


app.use(routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await browserService.close();
  process.exit(0);
});

export default app;
