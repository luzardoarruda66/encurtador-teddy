import express from "express";
import sequelize from "./models";
import authRoutes from "./routes/authRoutes";
import urlRoutes from "./routes/urlRoutes";
import { redirectUrl } from "./controllers/urlController";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

const swaggerSetup = require("../swagger-output.json");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSetup));

app.use("/auth", authRoutes);
app.use("/url", urlRoutes);

app.get("/:shortUrl", redirectUrl);

const PORT = process.env.PORT || 3000;
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database sync...");
    app.listen(PORT, () => {
      console.log(`[server]: server is running on port: ${PORT}`);
    });
  })
  .catch((error: Error) => console.log("Fail to sync with database:", error));
