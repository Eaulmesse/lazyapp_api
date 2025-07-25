import express, { Request, Response, Router } from "express";
import userController from "../controllers/userController";

const appRouter = express.Router();

appRouter.post("/", (req: Request, res: Response) => {
    userController.create(req, res);
});

appRouter.post("/login", (req: Request, res: Response) => {
    userController.login(req, res);
});

// Routes pour la récupération de mot de passe
appRouter.post("/forgot-password", (req: Request, res: Response) => {
    userController.requestPasswordReset(req, res);
});

appRouter.post("/validate-reset-token", (req: Request, res: Response) => {
    userController.validateResetToken(req, res);
});

appRouter.post("/reset-password", (req: Request, res: Response) => {
    userController.resetPassword(req, res);
});

export default appRouter;