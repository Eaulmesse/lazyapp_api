import { DataSource } from "typeorm";
import { PORT, MYSQL_URI } from "./index";
import { Audit } from "../entities/Audit";
import { User } from "../entities/User";

export const AppDataSource = new DataSource({
  type: "mysql",
  url: MYSQL_URI,
  synchronize: false, // En développement seulement
  logging: true,
  entities: [Audit, User],
  migrations: ["src/migrations/**/*.ts"],
  subscribers: ["src/subscribers/**/*.ts"],
  charset: "utf8mb4",
  timezone: "Z",
});

// Initialiser la connexion
export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log("✅ Database connection established");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error;
  }
}; 