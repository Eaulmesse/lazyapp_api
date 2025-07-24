"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MYSQL_URI = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
// Chercher le fichier .env dans le dossier backend (3 niveaux au-dessus depuis dist/)
dotenv_1.default.config();
if (!process.env.PORT) {
    throw new Error("PORT is not defined in the environment variables");
    process.exit(1);
}
exports.PORT = parseInt(process.env.PORT, 10);
exports.MYSQL_URI = process.env.MYSQL_URI;
console.log("PORT: ", exports.PORT);
console.log("MYSQL_URI: ", exports.MYSQL_URI);
