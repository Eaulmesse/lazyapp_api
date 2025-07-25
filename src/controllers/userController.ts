import { Request, Response } from "express";
import UserService from "../services/userService";
import ResendService from "../services/resendService";
import { log } from "node:console";

async function create(req: Request, res: Response) {
    const user = await UserService.create(req.body);
    res.status(201).json(user);
}

async function login(req: Request, res: Response) {
    const user = await UserService.login(req.body);
    res.status(200).json(user);
}

// Demande de réinitialisation de mot de passe
async function requestPasswordReset(req: Request, res: Response) {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const resetToken = await UserService.generateResetToken(email);
        
        if (resetToken) {
            // Essayer Resend d'abord (gratuit et fiable)
            let emailSent = false;
            
            try {
                emailSent = await ResendService.sendPasswordResetEmail(email, resetToken);
                console.log('Email sent via Resend');
            } catch (error) {
                console.log('Resend failed, trying Mailgun...');
            }
            
            if (!emailSent) {
                console.error(`Failed to send reset email to ${email}`);
            }
        }

        // Toujours retourner un succès pour éviter l'énumération d'emails
        res.status(200).json({ 
            message: "If the email exists, a reset link has been sent" 
        });
        
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

// Validation du token de réinitialisation
async function validateResetToken(req: Request, res: Response) {
    try {
        const { token } = req.body;
        
        if (!token) {
            return res.status(400).json({ message: "Token is required" });
        }

        const user = await UserService.validateResetToken(token);
        
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        res.status(200).json({ message: "Token is valid" });
        
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

// Réinitialisation du mot de passe
async function resetPassword(req: Request, res: Response) {
    try {
        const { token, newPassword } = req.body;
        
        if (!token || !newPassword) {
            return res.status(400).json({ message: "Token and new password are required" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const success = await UserService.resetPassword(token, newPassword);
        
        if (!success) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        res.status(200).json({ message: "Password reset successfully" });
        
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export default {
    create,
    login,
    requestPasswordReset,
    validateResetToken,
    resetPassword,
}