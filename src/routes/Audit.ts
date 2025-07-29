// Dans votre fichier audit.ts (ou auditController.ts si le log est dans le controller)
import express, { Request, Response } from "express";
import auditController from "../controllers/AuditController"; // Assurez-vous que le chemin est correct

const auditRouter = express.Router(); // Ou whatever your router variable is named

console.log("audit.ts: Audit router file loaded."); // Nouveau log au début du fichier

// Tous les audits
auditRouter.get("/", (req: Request, res: Response) => {
  console.log("audit.ts: GET / route hit!"); // Nouveau log à l'intérieur de la route
  auditController.list(req, res);
});

// Détails d'un audit
auditRouter.get("/:id", (req: Request, res: Response) => {
  auditController.read(req, res);
});

// Créer un audit
auditRouter.post("/", (req: Request, res: Response) => {
  auditController.create(req, res);
});

// Modifier un audit
auditRouter.put("/:id", (req: Request, res: Response) => {
  auditController.update(req, res);
});

// Supprimer un audit
auditRouter.delete("/:id", (req: Request, res: Response) => {
  auditController.remove(req, res);
});

export default auditRouter; 