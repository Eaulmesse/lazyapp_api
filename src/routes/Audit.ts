import express, { Request, Response, Router } from "express";
import auditController from "../controllers/AuditController";

const appRouter = express.Router();


// Tous les artistes
appRouter.get("/", (req: Request, res: Response) => {
  auditController.list(req, res);
});

// Détails d'un artiste
appRouter.get("/:id", (req: Request, res: Response) => {
  auditController.read(req, res);
});

// Créer un artiste
appRouter.post("/", (req: Request, res: Response) => {
  auditController.create(req, res);
});

// Modifier un artiste
appRouter.put("/:id", (req: Request, res: Response) => {
  auditController.update(req, res);
});

// Supprimer un artiste
appRouter.delete("/:id", (req: Request, res: Response) => {
  auditController.remove(req, res);
});

export default appRouter;