import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME || "encurtador-teddy",
  process.env.DB_USER || "postgres",
  process.env.DB_PASSWORD || "postgres",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
  }
);

export default sequelize;
