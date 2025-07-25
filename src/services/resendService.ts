import { Resend } from 'resend';

class ResendService {
    private resend: Resend;

    constructor() {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            throw new Error('RESEND_API_KEY is not defined');
        }
        this.resend = new Resend(apiKey);
    }

    async sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
        try {
            const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
            
            const { data, error } = await this.resend.emails.send({
                from: process.env.FROM_EMAIL || 'noreply@votreapp.com',
                to: [email],
                subject: 'Réinitialisation de votre mot de passe',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                        <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                            <h2 style="color: #333; text-align: center; margin-bottom: 30px;">🔐 Réinitialisation de mot de passe</h2>
                            
                            <p style="color: #666; line-height: 1.6;">Bonjour,</p>
                            
                            <p style="color: #666; line-height: 1.6;">
                                Vous avez demandé la réinitialisation de votre mot de passe pour votre compte.
                            </p>
                            
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${resetUrl}" 
                                   style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                                          color: white; padding: 15px 30px; text-decoration: none; 
                                          border-radius: 25px; font-weight: bold; font-size: 16px;
                                          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                                    🔑 Réinitialiser mon mot de passe
                                </a>
                            </div>
                            
                            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                                <p style="color: #666; margin: 0; font-size: 14px;">
                                    <strong>⚠️ Important :</strong> Ce lien est valide pendant <strong>1 heure</strong> seulement.
                                </p>
                            </div>
                            
                            <p style="color: #666; line-height: 1.6; font-size: 14px;">
                                Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité.
                            </p>
                            
                            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                            
                            <p style="color: #999; text-align: center; font-size: 12px;">
                                Cet email a été envoyé automatiquement, merci de ne pas y répondre.<br>
                                L'équipe de votre application
                            </p>
                        </div>
                    </div>
                `
            });

            if (error) {
                console.error('Erreur Resend:', error);
                return false;
            }

            console.log('Email envoyé via Resend:', data);
            return true;
        } catch (error) {
            console.error('Erreur envoi email Resend:', error);
            return false;
        }
    }

    async testConnection(): Promise<boolean> {
        try {
            const { data, error } = await this.resend.emails.send({
                from: process.env.FROM_EMAIL || 'noreply@votreapp.com',
                to: ['test@example.com'],
                subject: 'Test Resend Service',
                html: '<p>Ceci est un test du service Resend.</p>'
            });

            if (error) {
                console.error('Erreur test Resend:', error);
                return false;
            }

            console.log('Test Resend réussi:', data);
            return true;
        } catch (error) {
            console.error('Erreur test Resend:', error);
            return false;
        }
    }
}

export default new ResendService(); 