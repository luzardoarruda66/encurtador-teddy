const swaggerAutogen = require('swagger-autogen')();

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

const routes = ["./src/routes/authroutes.ts", "./src/routes/urlroutes.ts"];
swaggerAutogen("./swagger-output.json", routes, swaggerOptions);
