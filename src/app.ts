import "reflect-metadata";
import express, { Request, Response } from "express";
import { PORT, MYSQL_URI } from "./config";
import { initializeDatabase } from "./config/database";
import routes from "./routes/index";

const app = express();

// Middleware pour parser le JSON
app.use(express.json());
app.use("/api", routes);

app.get("/", (request: Request, response: Response) => { 
  console.log("MYSQL_URI: ", MYSQL_URI);
  response.status(200).send("Hello World");
}); 

// Initialiser la base de données et démarrer le serveur
const startServer = async () => {
  try {
    await initializeDatabase();
    
    app.listen(PORT, () => { 
      console.log("🚀 Server running at PORT: ", PORT); 
    }).on("error", (error) => {
      console.error("❌ Server error:", error);
      throw new Error(error.message);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();