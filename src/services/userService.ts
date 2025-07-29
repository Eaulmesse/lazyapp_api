import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import PrismaService from "./PrismaService";

class UserService {
    async create(userData: { email: string; password: string }) {
        try {
            const hashedPassword = await this.hashPassword(userData.password);
            return await PrismaService.createUser({
                email: userData.email,
                password: hashedPassword,
            });
        } catch (error) {
            throw new Error("Failed to create user");
        }
    }

    async findByEmail(email: string) {
        return await PrismaService.findUserByEmail(email);
    }

    async findById(id: number) {
        return await PrismaService.findUserById(id);
    }

    async update(id: number, userData: Partial<{ email: string; password: string }>) {
        const user = await this.findById(id);
        if (!user) {
            throw new Error("User not found");
        }
        
        const updateData: any = { ...userData };
        if (userData.password) {
            updateData.password = await this.hashPassword(userData.password);
        }
        
        return await PrismaService.client.user.update({
            where: { id },
            data: updateData,
        });
    }

    async delete(id: number): Promise<void> {
        const user = await this.findById(id);
        if (!user) {
            throw new Error("User not found");
        }
        await PrismaService.client.user.delete({ where: { id } });
    }

    async findAll() {
        return await PrismaService.client.user.findMany();
    }

    async login(userData: { email: string; password: string }): Promise<string | null> {
        if (!userData.email || !userData.password) {
            throw new Error("Email and password are required");
        }
        const user = await this.findByEmail(userData.email);

        if (!user) {
            throw new Error("User not found");
        }

        const isPasswordValid = await this.comparePassword(userData.password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }

        const token = await this.createToken(user);
        return token;
    }

    async createToken(user: { id: number; email: string }): Promise<string> {
        const payload = {
            id: user.id,
            email: user.email
        };
        return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
    }

    async hashPassword(password: string): Promise<string> {
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        return await bcrypt.hash(password, 10);
    }

    async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }

    // Méthode pour générer un token de réinitialisation
    async generateResetToken(email: string): Promise<string | null> {
        const user = await this.findByEmail(email);
        if (!user) {
            return null; // Ne pas révéler si l'email existe ou non
        }

        // Générer un token temporaire (valide 1 heure)
        const resetToken = jwt.sign(
            { email: user.email, type: 'password_reset' },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return resetToken;
    }

    // Méthode pour valider le token de réinitialisation
    async validateResetToken(token: string) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as any;
            
            if (decoded.type !== 'password_reset') {
                return null;
            }

            const user = await this.findByEmail(decoded.email);
            return user;
        } catch (error) {
            return null; // Token invalide ou expiré
        }
    }

    // Méthode pour réinitialiser le mot de passe
    async resetPassword(token: string, newPassword: string): Promise<boolean> {
        const user = await this.validateResetToken(token);
        if (!user) {
            return false;
        }

        try {
            const hashedPassword = await this.hashPassword(newPassword);
            await PrismaService.client.user.update({
                where: { id: user.id },
                data: { password: hashedPassword },
            });
            return true;
        } catch (error) {
            return false;
        }
    }
}

export default new UserService(); 