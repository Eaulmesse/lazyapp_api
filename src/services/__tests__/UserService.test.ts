import UserService from "../UserService";
import PrismaService from "../PrismaService";

jest.mock("../UserService");

describe("UserService", () => {
    
    const mockUser = {
        id: 1,
        email: "test@test.com",
        password: "test",
        createdAt: new Date(),
        updatedAt: new Date()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("findAll", () => {
        it("should return all users successfully", async () => {
            const mockPrismaService = PrismaService as jest.Mocked<typeof PrismaService>;
            mockPrismaService.findAllUsers.mockResolvedValue([mockUser]);
        });

        it("should throw error when database fails", async () => {
            const mockPrismaService = PrismaService as jest.Mocked<typeof PrismaService>;
            mockPrismaService.findAllUsers.mockRejectedValue(new Error("Database error"));
            await expect(UserService.findAll()).rejects.toThrow("Failed to fetch users");
        });

        it("should return empty array when no users are found", async () => {
            const mockPrismaService = PrismaService as jest.Mocked<typeof PrismaService>;
            mockPrismaService.findAllUsers.mockResolvedValue([]);
            const result = await UserService.findAll();
            expect(result).toEqual([]);
        });

    });

    describe("findById", () => {
        it("should return user by ID successfully", async () => {
            const mockPrismaService = PrismaService as jest.Mocked<typeof PrismaService>;
            mockPrismaService.findUserById.mockResolvedValue(mockUser);
            const result = await UserService.findById(1);
            expect(result).toEqual(mockUser);
        });

        it("should throw error when database fails", async () => {
            const mockPrismaService = PrismaService as jest.Mocked<typeof PrismaService>;
            mockPrismaService.findUserById.mockRejectedValue(new Error("Database error"));
            await expect(UserService.findById(1)).rejects.toThrow("Failed to fetch user by ID");
        });

        it("should return null when user not found", async () => {
            const mockPrismaService = PrismaService as jest.Mocked<typeof PrismaService>;
            mockPrismaService.findUserById.mockResolvedValue(null);
            const result = await UserService.findById(1);
            expect(result).toBeNull();
        }); 
    });

    describe("findByEmail", () => { 
        it("should return user by email successfully", async () => {
            const mockPrismaService = PrismaService as jest.Mocked<typeof PrismaService>;
            mockPrismaService.findUserByEmail.mockResolvedValue(mockUser);
            const result = await UserService.findByEmail("test@test.com");
            expect(result).toEqual(mockUser);
        });

        it("should throw error when database fails", async () => {
            const mockPrismaService = PrismaService as jest.Mocked<typeof PrismaService>;
            mockPrismaService.findUserByEmail.mockRejectedValue(new Error("Database error"));
            await expect(UserService.findByEmail("test@test.com")).rejects.toThrow("Failed to fetch user by email");
        });

        it("should return null when user not found", async () => {
            const mockPrismaService = PrismaService as jest.Mocked<typeof PrismaService>;
            mockPrismaService.findUserByEmail.mockResolvedValue(null);
            const result = await UserService.findByEmail("test@test.com");
            expect(result).toBeNull();
        });
    });

    describe("create", () => {
        it("should create user successfully", async () => {
            const mockPrismaService = PrismaService as jest.Mocked<typeof PrismaService>;
            mockPrismaService.createUser.mockResolvedValue(mockUser);
            const result = await UserService.create(mockUser);
            expect(result).toEqual(mockUser);
        });

        it("should throw error when database fails", async () => {
            const mockPrismaService = PrismaService as jest.Mocked<typeof PrismaService>;
            mockPrismaService.createUser.mockRejectedValue(new Error("Database error"));
            await expect(UserService.create(mockUser)).rejects.toThrow("Failed to create user");
        });

        it("should throw error when email is already in use", async () => {     
            const mockPrismaService = PrismaService as jest.Mocked<typeof PrismaService>;
            mockPrismaService.createUser.mockRejectedValue(new Error("Email already in use"));
            await expect(UserService.create(mockUser)).rejects.toThrow("Email already in use");
        });

        it("should throw error when password is not provided", async () => {
            const mockPrismaService = PrismaService as jest.Mocked<typeof PrismaService>;
            mockPrismaService.createUser.mockRejectedValue(new Error("Password is required"));
            await expect(UserService.create(mockUser)).rejects.toThrow("Password is required");
        });
    });

    describe("update", () => {
        it("should update user successfully", async () => {
            const mockPrismaService = PrismaService as jest.Mocked<typeof PrismaService>;
            mockPrismaService.updateUser.mockResolvedValue(mockUser);
            const result = await UserService.update(1, mockUser);
            expect(result).toEqual(mockUser);
        });

        it("should throw error when database fails", async () => {
            const mockPrismaService = PrismaService as jest.Mocked<typeof PrismaService>;
            mockPrismaService.updateUser.mockRejectedValue(new Error("Database error"));
            await expect(UserService.update(1, mockUser)).rejects.toThrow("Failed to update user");
        });

        it("should throw error when user not found", async () => {
            const mockPrismaService = PrismaService as jest.Mocked<typeof PrismaService>;
            // @ts-expect-error: Simulate user not found by returning undefined
            mockPrismaService.updateUser.mockResolvedValue(undefined);
            await expect(UserService.update(1, mockUser)).rejects.toThrow("User not found");
        });

        it("should throw error when email is already in use", async () => {
            const mockPrismaService = PrismaService as jest.Mocked<typeof PrismaService>;
            mockPrismaService.updateUser.mockRejectedValue(new Error("Email already in use"));
            await expect(UserService.update(1, mockUser)).rejects.toThrow("Email already in use");
        });

        it("should throw error when password is not provided", async () => {
            const mockPrismaService = PrismaService as jest.Mocked<typeof PrismaService>;
            mockPrismaService.updateUser.mockRejectedValue(new Error("Password is required"));
            await expect(UserService.update(1, mockUser)).rejects.toThrow("Password is required");
        });

    });

    describe("delete", () => {
        it("should delete user successfully", async () => {
            const mockPrismaService = PrismaService as jest.Mocked<typeof PrismaService>;
            mockPrismaService.deleteUser.mockResolvedValue(mockUser);
            const result = await UserService.delete(1);
            expect(result).toEqual(mockUser);
        });

        it("should throw error when database fails", async () => {
            const mockPrismaService = PrismaService as jest.Mocked<typeof PrismaService>;
            mockPrismaService.deleteUser.mockRejectedValue(new Error("Database error"));
            await expect(UserService.delete(1)).rejects.toThrow("Failed to delete user");
        });

        it("should throw error when user not found", async () => {
            const mockPrismaService = PrismaService as jest.Mocked<typeof PrismaService>;
            // @ts-expect-error: Simulate user not found by returning undefined
            mockPrismaService.deleteUser.mockResolvedValue(undefined);
            await expect(UserService.delete(1)).rejects.toThrow("User not found");
        });
    });

    describe("login", () => {
        it("should return user when login is successful", async () => {
            const mockPrismaService = PrismaService as jest.Mocked<typeof PrismaService>;
            mockPrismaService.findUserByEmail.mockResolvedValue(mockUser);
            const result = await UserService.login(mockUser);
            expect(result).toEqual(mockUser);
        });

        it("should throw error when email is not provided", async () => {
            const mockPrismaService = PrismaService as jest.Mocked<typeof PrismaService>;
            await expect(UserService.login({ email: "", password: "test" })).rejects.toThrow("Email and password are required");
        });

        it("should throw error when password is not provided", async () => {
            const mockPrismaService = PrismaService as jest.Mocked<typeof PrismaService>;
            await expect(UserService.login({ email: "test@test.com", password: "" })).rejects.toThrow("Email and password are required");
        });
    });

    


});
