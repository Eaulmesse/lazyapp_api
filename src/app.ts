// Dans votre fichier app.ts (le fichier principal)
import express, { Request, Response } from "express";
import cors from "cors";
import { PORT } from "./config";
import { initializeDatabase } from "./config/database";
import routes from "./routes/index"; // C'est votre routeur principal
import { authenticateToken } from "./middleware/auth";


const app = express();

app.use(cors());
// Augmenter la limite de taille pour les payloads Lighthouse
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

console.log("Attempting to mount API routes..."); // Nouveau log
// Appliquer le middleware d'authentification sur toutes les routes API
app.use("/api", authenticateToken, routes);
console.log("API routes mounted successfully (or attempted)."); // Nouveau log

app.get("/", (request: Request, response: Response) => {
    response.status(200).send("Hello World");
});

app.use("*", (req: Request, res: Response) => {
    console.log(`404: Route not found for path: ${req.originalUrl}`); // Modifié pour plus d'info
    res.status(404).json({
        message: "Route not found",
        path: req.originalUrl
    });
});

// Initialiser la base de données et démarrer le serveur
const startServer = async () => {
  try {
    // Démarrer le serveur même si la base de données n'est pas disponible
    app.listen(PORT, () => { 
      console.log("🚀 Server running at PORT: ", PORT); 
    }).on("error", (error) => {
      console.error("❌ Server error:", error);
      throw new Error(error.message);
    });
    
    // Essayer de se connecter à la base de données en arrière-plan
    try {
      await initializeDatabase();
      console.log("✅ Database connection established");
    } catch (error) {
      console.warn("⚠️ Database connection failed, but server is running:", error);
    }
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();