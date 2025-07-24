import { Repository } from "typeorm";
import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import bcrypt  from "bcrypt";

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