import SessionService from "../services/SessionService";

// Fonction utilitaire pour récupérer l'utilisateur depuis les headers
export function getUserFromHeaders(req: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  return token ? SessionService.getUser(token) : null;
}

// Fonction utilitaire pour récupérer l'ID utilisateur depuis les headers
export function getUserIdFromHeaders(req: any) {
  const user = getUserFromHeaders(req);
  return user?.id || null;
} 