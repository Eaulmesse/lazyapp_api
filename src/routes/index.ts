// Dans votre fichier routes/index.ts
import express from "express";

const appRouter = express.Router();

console.log("routes/index.ts: Initializing main API router."); // Nouveau log

// Montage conditionnel des routes pour éviter les erreurs d'import
try {
    console.log("routes/index.ts: Loading audit routes...");
    const auditRoutes = require("./audit").default;
    appRouter.use("/audit", auditRoutes);
    console.log("routes/index.ts: /audit routes mounted successfully.");
} catch (error) {
    console.error("routes/index.ts: Error loading audit routes:", error);
}

try {
    console.log("routes/index.ts: Loading user routes...");
    const userRoutes = require("./user").default;
    appRouter.use("/user", userRoutes);
    console.log("routes/index.ts: /user routes mounted successfully.");
} catch (error) {
    console.error("routes/index.ts: Error loading user routes:", error);
}


export default appRouter;