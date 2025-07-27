"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FROM_EMAIL = exports.RESEND_DOMAIN = exports.RESEND_API_KEY = exports.JWT_SECRET = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
// Charger les variables d'environnement
dotenv_1.default.config();
if (!process.env.PORT) {
    throw new Error("PORT is not defined in the environment variables");
    process.exit(1);
}
exports.PORT = parseInt(process.env.PORT, 10);
exports.JWT_SECRET = process.env.JWT_SECRET;
// Configuration Resend (optionnel)
exports.RESEND_API_KEY = process.env.RESEND_API_KEY_;
exports.RESEND_DOMAIN = process.env.RESEND__DOMAIN;
exports.FROM_EMAIL = process.env.FROM_EMAIL;
console.log("PORT: ", exports.PORT);
