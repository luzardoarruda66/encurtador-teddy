import express from "express";
import sequelize from "./models";
import authRoutes from "./routes/authRoutes";
import urlRoutes from "./routes/urlRoutes";
import { redirectUrl } from "./controllers/urlController";
import swaggerUi from "swagger-ui-express";
import swaggerAutogen from "swagger-autogen";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Encurtamento de URL",
      version: "1.0.0",
      description:
        "API para encurtamento de URLs com funcionalidades de autenticação, atualização da url encurtada e contabilizador de clicks",
    },
  },
  apis: ["./src/routes/*.ts"],
};

const app = express();

app.use(express.json());

swaggerAutogen()("./swagger-output.json", swaggerOptions);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(require("../swagger-output.json"))
);

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
