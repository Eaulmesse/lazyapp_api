"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FROM_EMAIL = exports.RESEND_DOMAIN = exports.RESEND_API_KEY = exports.JWT_SECRET = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
// Charger les variables d'environnement
dotenv_1.default.config();
exports.PORT = parseInt(process.env.PORT || '3000', 10);
exports.JWT_SECRET = process.env.JWT_SECRET || 'default-jwt-secret';
exports.RESEND_API_KEY = process.env.RESEND_API_KEY || '';
exports.RESEND_DOMAIN = process.env.RESEND_DOMAIN || '';
exports.FROM_EMAIL = process.env.FROM_EMAIL || '';
if (process.env.NODE_ENV !== 'test') {
    console.log("PORT: ", exports.PORT);
}
