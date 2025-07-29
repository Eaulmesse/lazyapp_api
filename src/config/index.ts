import dotenv from "dotenv";
import { config } from "dotenv";	
// Charger les variables d'environnement
dotenv.config();


export const PORT: number = parseInt(process.env.PORT || '3000', 10);

export const JWT_SECRET: string = process.env.JWT_SECRET || 'default-jwt-secret';


export const RESEND_API_KEY: string = process.env.RESEND_API_KEY || '';
export const RESEND_DOMAIN: string = process.env.RESEND_DOMAIN || '';
export const FROM_EMAIL: string = process.env.FROM_EMAIL || '';


if (process.env.NODE_ENV !== 'test') {
    console.log("PORT: ", PORT);
}