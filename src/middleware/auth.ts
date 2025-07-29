import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import SessionService from "../services/SessionService";

// Interface pour étendre Request avec user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Routes publiques qui ne nécessitent pas d'authentification
const publicRoutes = [
  "/user/register",
  "/user/login",
  "/user/forgot-password",
  "/user/validate-reset-token",
  "/user/reset-password",
  "/user/test-resend",
];

// Middleware d'authentification
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // Vérifier si la route est publique
  const isPublicRoute = publicRoutes.some(route => req.path === route);
  console.log("isPublicRoute", isPublicRoute);
  console.log("req.path", req.path);
  
  // Récupérer le token depuis le header Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  // Si un token est présent, essayer de l'authentifier (pour toutes les routes)
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      SessionService.setUser(token, decoded);
    } catch (error) {
      // Token invalide
      if (isPublicRoute) {
        // Pour les routes publiques, on continue sans user
        console.log("Token invalide pour route publique:", error);
      } else {
        // Pour les routes protégées, on rejette
        return res.status(403).json({ 
          message: "Invalid or expired token",
          error: "FORBIDDEN"
        });
      }
    }
  }
  
  // Si c'est une route publique, passer au middleware suivant
  if (isPublicRoute) {
    return next();
  }

  // Pour les routes POST /api/user (création de compte)
  if (req.path === "/api/user" && req.method === "POST") {
    return next();
  }

  // Pour les routes protégées, vérifier que le token est présent
  if (!token) {
    return res.status(401).json({ 
      message: "Access token required",
      error: "UNAUTHORIZED"
    });
  }
  
  next();
};

// Middleware optionnel pour récupérer l'utilisateur si token présent
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      SessionService.setUser(token, decoded);
    } catch (error) {
      // Token invalide, mais on continue sans user
    }
  }
  
  next();
}; 