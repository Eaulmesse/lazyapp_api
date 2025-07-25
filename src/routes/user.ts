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

// Route de test pour Mailgun (à supprimer en production)
appRouter.get("/test-resend", async (req: Request, res: Response) => {
    try {
        
        
        const ResendService = require("../services/resendService").default;
        const success = await ResendService.testConnection();
        
        if (success) {
            res.status(200).json({ 
                message: "Resend configuration is working",
                status: "success"
            });
        } else {
            res.status(500).json({ 
                message: "Resend configuration failed",
                status: "error"
            });
        }
    } catch (error) {
        res.status(500).json({ 
            message: "Error testing Resend", 
            error: (error as Error).message,
            status: "error"
        });
    }
});

export default appRouter;