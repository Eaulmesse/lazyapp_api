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
export const JWT_SECRET: string = process.env.JWT_SECRET as string;

// Configuration Mailgun
export const RESEND_API_KEY: string = process.env.RESEND_API_KEY_ as string;
export const RESEND_DOMAIN: string = process.env.RESEND__DOMAIN as string;
export const FROM_EMAIL: string = process.env.FROM_EMAIL as string;

console.log("PORT: ", PORT);