import SequelizePkg from "sequelize";
const Sequelize = SequelizePkg?.Sequelize ?? SequelizePkg;
import { config } from "./config.js";

const isProduction = process.env.NODE_ENV === "production";

// Usa DATABASE_URL (Vercel) o DATABASE_URL_LOCAL (local)
const connectionString = isProduction
  ? process.env.DATABASE_URL
  : process.env.DATABASE_URL_LOCAL;

const sequelize = new Sequelize(connectionString, {
  dialect: "postgres",
  logging: config.env === "development" ? console.log : false,

  dialectOptions: isProduction
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {},
});

export default sequelize;
