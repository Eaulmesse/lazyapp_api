import PrismaService from "../services/PrismaService";

// Initialiser la connexion Prisma
export const initializeDatabase = async () => {
  try {
    await PrismaService.connect();
    console.log("✅ Database connection established with Prisma");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error;
  }
};

export { PrismaService }; 