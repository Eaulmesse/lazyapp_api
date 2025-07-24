import dotenv from "dotenv";
import path from "path";

// Chercher le fichier .env dans le dossier backend (3 niveaux au-dessus depuis dist/)
dotenv.config();

if (!process.env.PORT) {
    throw new Error("PORT is not defined in the environment variables");
    process.exit(1);
}

export const PORT: number = parseInt(process.env.PORT, 10);
export const MYSQL_URI: string = process.env.MYSQL_URI as string;

console.log("PORT: ", PORT);
console.log("MYSQL_URI: ", MYSQL_URI);