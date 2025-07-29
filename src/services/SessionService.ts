// Service de session en mémoire pour stocker les utilisateurs connectés
class SessionService {
  private sessions = new Map<string, any>();

  // Stocker un utilisateur avec son token
  setUser(token: string, user: any) {
    this.sessions.set(token, user);
  }

  // Récupérer un utilisateur par son token
  getUser(token: string) {
    return this.sessions.get(token);
  }

  // Supprimer un utilisateur
  removeUser(token: string) {
    this.sessions.delete(token);
  }

  // Nettoyer les sessions expirées (optionnel)
  cleanup() {
    // Ici vous pourriez ajouter une logique pour nettoyer les sessions expirées
    console.log(`Sessions actives: ${this.sessions.size}`);
  }
}

export default new SessionService(); 