import UserService from "../UserService";
import PrismaService from "../PrismaService";
import { jest } from "@jest/globals";
import { describe, it, beforeEach, expect } from "@jest/globals";

// Mock PrismaService
jest.mock("../PrismaService", () => ({
  __esModule: true,
  default: {
    client: {
      user: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    },
    createUser: jest.fn(),
    findAllUsers: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
    findUserByEmail: jest.fn(),
    findUserById: jest.fn(),
  },
}));

// Mock bcrypt
jest.mock("bcrypt", () => ({
  genSalt: jest.fn(),
  hash: jest.fn(),
  compare: jest.fn(),
}));

// Mock jsonwebtoken
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

describe("UserService", () => {
    
    const mockUser = {
        id: 1,
        email: "test@test.com",
        password: "hashedPassword",
        createdAt: new Date(),
        updatedAt: new Date()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("findAll", () => {
        it("should return all users successfully", async () => {
            const mockPrismaService = PrismaService as jest.Mocked<typeof PrismaService>;
            mockPrismaService.client.user.findMany.mockResolvedValue([mockUser]);
            const result = await UserService.findAll();
            expect(result).toEqual([mockUser]);
        });

        it("should return empty array when no users are found", async () => {
            const mockPrismaService = PrismaService as jest.Mocked<typeof PrismaService>;
            mockPrismaService.client.user.findMany.mockResolvedValue([]);
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
            const bcrypt = require("bcrypt");
            
            bcrypt.genSalt.mockResolvedValue("salt");
            bcrypt.hash.mockResolvedValue("hashedPassword");
            mockPrismaService.createUser.mockResolvedValue(mockUser);
            
            const result = await UserService.create({ email: "test@test.com", password: "password" });
            expect(result).toEqual(mockUser);
        });

        it("should throw error when database fails", async () => {
            const mockPrismaService = PrismaService as jest.Mocked<typeof PrismaService>;
            const bcrypt = require("bcrypt");
            
            bcrypt.genSalt.mockResolvedValue("salt");
            bcrypt.hash.mockResolvedValue("hashedPassword");
            mockPrismaService.createUser.mockRejectedValue(new Error("Database error"));
            
            await expect(UserService.create({ email: "test@test.com", password: "password" })).rejects.toThrow("Failed to create user");
        });
    });

    describe("update", () => {
        it("should update user successfully", async () => {
            const mockPrismaService = PrismaService as jest.Mocked<typeof PrismaService>;
            mockPrismaService.findUserById.mockResolvedValue(mockUser);
            mockPrismaService.client.user.update.mockResolvedValue(mockUser);
            const result = await UserService.update(1, { email: "new@test.com" });
            expect(result).toEqual(mockUser);
        });

        it("should throw error when user not found", async () => {
            const mockPrismaService = PrismaService as jest.Mocked<typeof PrismaService>;
            mockPrismaService.findUserById.mockResolvedValue(null);
            await expect(UserService.update(1, { email: "new@test.com" })).rejects.toThrow("User not found");
        });
    });

    describe("delete", () => {
        it("should delete user successfully", async () => {
            const mockPrismaService = PrismaService as jest.Mocked<typeof PrismaService>;
            mockPrismaService.findUserById.mockResolvedValue(mockUser);
            mockPrismaService.client.user.delete.mockResolvedValue(mockUser);
            await expect(UserService.delete(1)).resolves.toBeUndefined();
        });

        it("should throw error when user not found", async () => {
            const mockPrismaService = PrismaService as jest.Mocked<typeof PrismaService>;
            mockPrismaService.findUserById.mockResolvedValue(null);
            await expect(UserService.delete(1)).rejects.toThrow("User not found");
        });
    });

    describe("login", () => {
        it("should return token when login is successful", async () => {
            const mockPrismaService = PrismaService as jest.Mocked<typeof PrismaService>;
            const bcrypt = require("bcrypt");
            const jwt = require("jsonwebtoken");
            
            mockPrismaService.findUserByEmail.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue("mock.jwt.token");
            
            const result = await UserService.login({ email: "test@test.com", password: "password" });
            expect(result).toBe("mock.jwt.token");
        });

        it("should throw error when email is not provided", async () => {
            await expect(UserService.login({ email: "", password: "test" })).rejects.toThrow("Email and password are required");
        });

        it("should throw error when password is not provided", async () => {
            await expect(UserService.login({ email: "test@test.com", password: "" })).rejects.toThrow("Email and password are required");
        });

        it("should throw error when user not found", async () => {
            const mockPrismaService = PrismaService as jest.Mocked<typeof PrismaService>;
            mockPrismaService.findUserByEmail.mockResolvedValue(null);
            await expect(UserService.login({ email: "test@test.com", password: "password" })).rejects.toThrow("User not found");
        });

        it("should throw error when password is invalid", async () => {
            const mockPrismaService = PrismaService as jest.Mocked<typeof PrismaService>;
            const bcrypt = require("bcrypt");
            
            mockPrismaService.findUserByEmail.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);
            
            await expect(UserService.login({ email: "test@test.com", password: "wrongpassword" })).rejects.toThrow("Invalid password");
        });
    });
});
