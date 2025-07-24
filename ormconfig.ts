import { DataSource } from "typeorm";
import dotenv from "dotenv";

// Charger les variables d'environnement
dotenv.config();

export default new DataSource({
  type: "mysql",
  url: process.env.MYSQL_URI,
  synchronize: false,
  logging: true,
  entities: ["src/entities/**/*.ts"],
  migrations: ["src/migrations/**/*.ts"],
  subscribers: [],
  charset: "utf8mb4",
  timezone: "Z",
}); 