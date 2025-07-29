import express, { Request, Response, Router } from "express";
import UserController from "../controllers/UserController";
import ResendService from "../services/ResendService";

const appRouter = express.Router();

console.log("user.ts: User router file loaded."); // Nouveau log

// Route de test GET (protégée)
appRouter.get("/", (req: Request, res: Response) => {
    console.log("user.ts: GET / route hit!"); // Nouveau log
    res.status(200).json({ 
        message: "User routes are working!",
        user: req.user,
        authenticated: true
    });
});

appRouter.post("/register", (req: Request, res: Response) => {
    console.log("user.ts: POST / route hit!"); // Nouveau log
    UserController.create(req, res);
});

appRouter.post("/login", (req: Request, res: Response) => {
    UserController.login(req, res);
});

// Routes pour la récupération de mot de passe
appRouter.post("/forgot-password", (req: Request, res: Response) => {
    UserController.requestPasswordReset(req, res);
});

appRouter.post("/validate-reset-token", (req: Request, res: Response) => {
    UserController.validateResetToken(req, res);
});

appRouter.post("/reset-password", (req: Request, res: Response) => {
    UserController.resetPassword(req, res);
});

// Route de test pour Mailgun (à supprimer en production)
appRouter.get("/test-resend", async (req: Request, res: Response) => {
    try {
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