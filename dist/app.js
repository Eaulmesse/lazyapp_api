"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Dans votre fichier app.ts (le fichier principal)
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
const database_1 = require("./config/database");
const index_1 = __importDefault(require("./routes/index")); // C'est votre routeur principal
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
console.log("Attempting to mount API routes..."); // Nouveau log
app.use("/api", index_1.default);
console.log("API routes mounted successfully (or attempted)."); // Nouveau log
app.get("/", (request, response) => {
    response.status(200).send("Hello World");
});
app.use("*", (req, res) => {
    console.log(`404: Route not found for path: ${req.originalUrl}`); // Modifié pour plus d'info
    res.status(404).json({
        message: "Route not found",
        path: req.originalUrl
    });
});
// Initialiser la base de données et démarrer le serveur
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Démarrer le serveur même si la base de données n'est pas disponible
        app.listen(config_1.PORT, () => {
            console.log("🚀 Server running at PORT: ", config_1.PORT);
        }).on("error", (error) => {
            console.error("❌ Server error:", error);
            throw new Error(error.message);
        });
        // Essayer de se connecter à la base de données en arrière-plan
        try {
            yield (0, database_1.initializeDatabase)();
            console.log("✅ Database connection established");
        }
        catch (error) {
            console.warn("⚠️ Database connection failed, but server is running:", error);
        }
    }
    catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
});
startServer();
