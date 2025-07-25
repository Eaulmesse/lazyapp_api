import { Repository } from "typeorm";
import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import bcrypt  from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";



class UserService {
    private userRepository: Repository<User>;

    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
    }

    async create(userData: Partial<User>): Promise<User> {
        try {

            
            
            const newUser = this.userRepository.create(userData);
            console.log("HERE");
            newUser.password = await this.hashPassword(newUser.password);
            
            return this.userRepository.save(newUser);
        } catch (error) {
            throw new Error("Failed to create user");
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { email } });
    }

    async findById(id: number): Promise<User | null> {
        return this.userRepository.findOne({ where: { id } });
    }

    async update(id: number, userData: Partial<User>): Promise<User | null> {
        const user = await this.findById(id);
        if (!user) {
            throw new Error("User not found");
        }
        return this.userRepository.save({ ...user, ...userData });
    }

    async delete(id: number): Promise<void> {
        const user = await this.findById(id);
        if (!user) {
            throw new Error("User not found");
        }
        await this.userRepository.delete(id);
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async login(userData: Partial<User>): Promise<string | null> {
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

    async createToken(user: User): Promise<string> {
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
}

export default new UserService();