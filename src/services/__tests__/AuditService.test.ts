import AuditService from "../AuditService";
import PrismaService from "../PrismaService";

// Mock PrismaService au lieu d'AuditService
jest.mock("../PrismaService");

describe("AuditService", () => {
    // Données fictives pour les tests
    const mockAuditData = {
        action: "CREATE",
        tableName: "users",
        recordId: 123,
        oldValues: null,
        newValues: { email: "test@example.com", name: "John Doe" },
        userId: 1
    };

    const mockUser = {
        id: 1,
        email: "admin@example.com",
        password: "hashedpassword",
        createdAt: new Date("2024-01-15T10:30:00Z"),
        updatedAt: new Date("2024-01-15T10:30:00Z")
    };

    const mockAudit = {
        id: 1,
        action: "CREATE",
        tableName: "users",
        recordId: 123,
        oldValues: null,
        newValues: { email: "test@example.com", name: "John Doe" },
        userId: 1,
        createdAt: new Date("2024-01-15T10:30:00Z"),
        updatedAt: new Date("2024-01-15T10:30:00Z"),
        user: mockUser
    };

    const mockAudits = [
        {
            id: 1,
            action: "CREATE",
            tableName: "users",
            recordId: 123,
            oldValues: null,
            newValues: { email: "user1@example.com" },
            userId: 1,
            createdAt: new Date("2024-01-15T10:30:00Z"),
            updatedAt: new Date("2024-01-15T10:30:00Z"),
            user: mockUser
        },
        {
            id: 2,
            action: "UPDATE",
            tableName: "users",
            recordId: 456,
            oldValues: { status: "inactive" },
            newValues: { status: "active" },
            userId: 2,
            createdAt: new Date("2024-01-15T11:00:00Z"),
            updatedAt: new Date("2024-01-15T11:00:00Z"),
            user: {
                id: 2,
                email: "manager@example.com",
                password: "hashedpassword",
                createdAt: new Date("2024-01-15T10:30:00Z"),
                updatedAt: new Date("2024-01-15T10:30:00Z")
            }
        },
        {
            id: 3,
            action: "DELETE",
            tableName: "posts",
            recordId: 789,
            oldValues: { title: "Old Post", content: "Old content" },
            newValues: null,
            userId: 3,
            createdAt: new Date("2024-01-15T12:00:00Z"),
            updatedAt: new Date("2024-01-15T12:00:00Z"),
            user: {
                id: 3,
                email: "editor@example.com",
                password: "hashedpassword",
                createdAt: new Date("2024-01-15T10:30:00Z"),
                updatedAt: new Date("2024-01-15T10:30:00Z")
            }
        }
    ];

    beforeEach(() => {
        // Reset tous les mocks avant chaque test
        jest.clearAllMocks();
    });

    describe("findAll", () => {
        it("should return all audits successfully", async () => {
            // Arrange
            const mockPrismaService = PrismaService as jest.Mocked<typeof PrismaService>;
            mockPrismaService.findAllAudits.mockResolvedValue(mockAudits);

            // Act
            const result = await AuditService.findAll();

            // Assert
            expect(result).toEqual(mockAudits);
            expect(mockPrismaService.findAllAudits).toHaveBeenCalledTimes(1);
        });

        it("should throw error when database fails", async () => {
            // Arrange
            const mockPrismaService = PrismaService as jest.Mocked<typeof PrismaService>;
            mockPrismaService.findAllAudits.mockRejectedValue(new Error("Database error"));

            // Act & Assert
            await expect(AuditService.findAll()).rejects.toThrow("Failed to fetch audits");
            expect(mockPrismaService.findAllAudits).toHaveBeenCalledTimes(1);
        });
    });

    describe("findById", () => {
        it("should return audit by ID successfully", async () => {
            // Arrange
            const mockPrismaService = PrismaService as jest.Mocked<typeof PrismaService>;
            mockPrismaService.findAuditById.mockResolvedValue(mockAudit);

            // Act
            const result = await AuditService.findById("1");

            // Assert
            expect(result).toEqual(mockAudit);
            expect(mockPrismaService.findAuditById).toHaveBeenCalledWith(1);
        });

        it("should return null when audit not found", async () => {
            // Arrange
            const mockPrismaService = PrismaService as jest.Mocked<typeof PrismaService>;
            mockPrismaService.findAuditById.mockResolvedValue(null);

            // Act
            const result = await AuditService.findById("999");

            // Assert
            expect(result).toBeNull();
            expect(mockPrismaService.findAuditById).toHaveBeenCalledWith(999);
        });

        it("should throw error when database fails", async () => {
            // Arrange
            const mockPrismaService = PrismaService as jest.Mocked<typeof PrismaService>;
            mockPrismaService.findAuditById.mockRejectedValue(new Error("Database error"));

            // Act & Assert
            await expect(AuditService.findById("1")).rejects.toThrow("Failed to fetch audit by ID");
        });
    });

    describe("create", () => {
        it("should create audit successfully", async () => {
            // Arrange
            const mockPrismaService = PrismaService as jest.Mocked<typeof PrismaService>;
            mockPrismaService.createAudit.mockResolvedValue(mockAudit);

            // Act
            const result = await AuditService.create(mockAuditData);

            // Assert
            expect(result).toEqual(mockAudit);
            expect(mockPrismaService.createAudit).toHaveBeenCalledWith(mockAuditData);
        });

        it("should create audit with minimal data", async () => {
            // Arrange
            const minimalData = {
                action: "LOGIN",
                tableName: "sessions"
            };
            const mockPrismaService = PrismaService as jest.Mocked<typeof PrismaService>;
            mockPrismaService.createAudit.mockResolvedValue({
                ...mockAudit,
                ...minimalData
            });

            // Act
            const result = await AuditService.create(minimalData);

            // Assert
            expect(result).toBeDefined();
            expect(mockPrismaService.createAudit).toHaveBeenCalledWith(minimalData);
        });

        it("should throw error when creation fails", async () => {
            // Arrange
            const mockPrismaService = PrismaService as jest.Mocked<typeof PrismaService>;
            mockPrismaService.createAudit.mockRejectedValue(new Error("Creation failed"));

            // Act & Assert
            await expect(AuditService.create(mockAuditData)).rejects.toThrow("Failed to create audit");
        });
    });

    describe("update", () => {
        it("should return null when audit not found", async () => {
            // Arrange
            const mockPrismaService = PrismaService as jest.Mocked<typeof PrismaService>;
            mockPrismaService.findAuditById.mockResolvedValue(null);

            // Act
            const result = await AuditService.update("999", { action: "UPDATE" });

            // Assert
            expect(result).toBeNull();
            expect(mockPrismaService.findAuditById).toHaveBeenCalledWith(999);
        });

        it("should throw error when findById fails", async () => {
            // Arrange
            const mockPrismaService = PrismaService as jest.Mocked<typeof PrismaService>;
            mockPrismaService.findAuditById.mockRejectedValue(new Error("Find failed"));

            // Act & Assert
            await expect(AuditService.update("1", { action: "UPDATE" })).rejects.toThrow("Failed to update audit");
        });
    });

    describe("delete", () => {
        it("should return false when audit not found", async () => {
            // Arrange
            const mockPrismaService = PrismaService as jest.Mocked<typeof PrismaService>;
            mockPrismaService.findAuditById.mockResolvedValue(null);

            // Act
            const result = await AuditService.delete("999");

            // Assert
            expect(result).toBe(false);
            expect(mockPrismaService.findAuditById).toHaveBeenCalledWith(999);
        });

        it("should throw error when findById fails", async () => {
            // Arrange
            const mockPrismaService = PrismaService as jest.Mocked<typeof PrismaService>;
            mockPrismaService.findAuditById.mockRejectedValue(new Error("Find failed"));

            // Act & Assert
            await expect(AuditService.delete("1")).rejects.toThrow("Failed to delete audit");
        });
    });

    describe("Edge Cases", () => {
        it("should handle invalid ID format", async () => {
            // Arrange
            const mockPrismaService = PrismaService as jest.Mocked<typeof PrismaService>;
            mockPrismaService.findAuditById.mockRejectedValue(new Error("Invalid ID"));

            // Act & Assert
            await expect(AuditService.findById("invalid")).rejects.toThrow("Failed to fetch audit by ID");
        });

        it("should handle empty audit data", async () => {
            // Arrange
            const emptyData = {
                action: "",
                tableName: ""
            };
            const mockPrismaService = PrismaService as jest.Mocked<typeof PrismaService>;
            mockPrismaService.createAudit.mockResolvedValue({
                ...mockAudit,
                ...emptyData
            });

            // Act
            const result = await AuditService.create(emptyData);

            // Assert
            expect(result).toBeDefined();
            expect(mockPrismaService.createAudit).toHaveBeenCalledWith(emptyData);
        });
    });
});