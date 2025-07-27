import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { authenticateToken, optionalAuth } from "../auth";
import { JWT_SECRET } from "../../config";

// Mock JWT
jest.mock("jsonwebtoken");

// Types pour les tests
interface MockRequest extends Partial<Request> {
  path: string;
  method: string;
  headers: Record<string, string>;
  user?: any;
}

interface MockResponse extends Partial<Response> {
  status: jest.MockedFunction<any>;
  json: jest.MockedFunction<any>;
}

// Helper pour créer des mocks
const createMockRequest = (overrides: Partial<MockRequest> = {}): MockRequest => ({
  path: "/api/user",
  method: "GET",
  headers: {},
  ...overrides,
});

const createMockResponse = (): MockResponse => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
});

const createMockNext = (): jest.MockedFunction<NextFunction> => jest.fn();

describe("Auth Middleware", () => {
  let mockRequest: MockRequest;
  let mockResponse: MockResponse;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    mockRequest = createMockRequest();
    mockResponse = createMockResponse();
    mockNext = createMockNext();
    jest.clearAllMocks();
  });

  describe("authenticateToken", () => {
    describe("Routes publiques", () => {
      const publicRoutes = [
        "/user/register",
        "/user/login",
        "/user/forgot-password",
        "/user/validate-reset-token",
        "/user/reset-password",
        "/user/test-resend"
      ];

      test.each(publicRoutes)("devrait permettre l'accès à %s sans token", (route) => {
        mockRequest.path = route;

        authenticateToken(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockNext).toHaveBeenCalledWith();
        expect(mockResponse.status).not.toHaveBeenCalled();
        expect(mockResponse.json).not.toHaveBeenCalled();
      });
    });

    describe("Route de création de compte", () => {
      test("devrait permettre l'accès à POST /api/user sans token", () => {
        mockRequest.path = "/api/user";
        mockRequest.method = "POST";

        authenticateToken(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockNext).toHaveBeenCalledWith();
        expect(mockResponse.status).not.toHaveBeenCalled();
        expect(mockResponse.json).not.toHaveBeenCalled();
      });
    });

    describe("Routes protégées", () => {
      test("devrait retourner 401 si aucun token n'est fourni", () => {
        mockRequest.path = "/api/user";
        mockRequest.method = "GET";

        authenticateToken(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: "Access token required",
          error: "UNAUTHORIZED"
        });
        expect(mockNext).not.toHaveBeenCalled();
      });

      test("devrait retourner 401 si le header Authorization est mal formaté", () => {
        mockRequest.path = "/api/user";
        mockRequest.headers = { authorization: "InvalidFormat" };

        authenticateToken(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: "Access token required",
          error: "UNAUTHORIZED"
        });
      });

      test("devrait retourner 403 si le token est invalide", () => {
        mockRequest.path = "/api/user";
        mockRequest.headers = { authorization: "Bearer invalid-token" };
        
        (jwt.verify as jest.Mock).mockImplementation(() => {
          throw new Error("Invalid token");
        });

        authenticateToken(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(403);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: "Invalid or expired token",
          error: "FORBIDDEN"
        });
        expect(mockNext).not.toHaveBeenCalled();
      });

      test("devrait permettre l'accès si le token est valide", () => {
        const mockUser = { id: 1, email: "test@test.com" };
        const validToken = "valid-token";
        
        mockRequest.path = "/api/user";
        mockRequest.headers = { authorization: `Bearer ${validToken}` };
        
        (jwt.verify as jest.Mock).mockReturnValue(mockUser);

        authenticateToken(mockRequest as Request, mockResponse as Response, mockNext);

        expect(jwt.verify).toHaveBeenCalledWith(validToken, JWT_SECRET);
        expect(mockRequest.user).toEqual(mockUser);
        expect(mockNext).toHaveBeenCalledWith();
        expect(mockResponse.status).not.toHaveBeenCalled();
        expect(mockResponse.json).not.toHaveBeenCalled();
      });
    });
  });

  describe("optionalAuth", () => {
    test("devrait continuer sans user si aucun token n'est fourni", () => {
      optionalAuth(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRequest.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalledWith();
    });

    test("devrait continuer sans user si le token est invalide", () => {
      mockRequest.headers = { authorization: "Bearer invalid-token" };
      
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      optionalAuth(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockRequest.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalledWith();
    });

    test("devrait définir user si le token est valide", () => {
      const mockUser = { id: 1, email: "test@test.com" };
      const validToken = "valid-token";
      
      mockRequest.headers = { authorization: `Bearer ${validToken}` };
      
      (jwt.verify as jest.Mock).mockReturnValue(mockUser);

      optionalAuth(mockRequest as Request, mockResponse as Response, mockNext);

      expect(jwt.verify).toHaveBeenCalledWith(validToken, JWT_SECRET);
      expect(mockRequest.user).toEqual(mockUser);
      expect(mockNext).toHaveBeenCalledWith();
    });
  });

  describe("Intégration", () => {
    test("devrait gérer les tokens expirés", () => {
      mockRequest.path = "/api/user";
      mockRequest.headers = { authorization: "Bearer expired-token" };
      
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new jwt.TokenExpiredError("Token expired", new Date());
      });

      authenticateToken(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Invalid or expired token",
        error: "FORBIDDEN"
      });
    });

    test("devrait gérer les tokens malformés", () => {
      mockRequest.path = "/api/user";
      mockRequest.headers = { authorization: "Bearer malformed-token" };
      
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new jwt.JsonWebTokenError("Invalid token");
      });

      authenticateToken(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Invalid or expired token",
        error: "FORBIDDEN"
      });
    });
  });
}); 