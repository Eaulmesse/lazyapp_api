import { PrismaClient } from '@prisma/client';

class PrismaService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async connect() {
    await this.prisma.$connect();
  }

  async disconnect() {
    await this.prisma.$disconnect();
  }

  get client() {
    return this.prisma;
  }

  // Méthodes pour User
  async createUser(userData: { email: string; password: string }) {
    return this.prisma.user.create({
      data: userData,
    });
  }

  async findAllUsers() {
    return this.prisma.user.findMany();
  }

  async updateUser(id: number, userData: { email: string; password: string }) {
    return this.prisma.user.update({
      where: { id },
      data: userData,
    });
  }

  async deleteUser(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findUserById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  // Méthodes pour Audit
  async createAudit(auditData: {
    action: string;
    tableName: string;
    recordId?: number;
    oldValues?: any;
    newValues?: any;
    userId?: number;
  }) {
    try {
      await this.prisma.$connect();
      return await this.prisma.audit.create({
        data: auditData,
      });
    } catch (error) {
      console.error('Error in createAudit:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to create audit: ${errorMessage}`);
    }
  }

  async findAllAudits() {
    try {
      // S'assurer que la connexion est établie
      await this.prisma.$connect();
      
      return await this.prisma.audit.findMany({
        select: {
          id: true,
          action: true,
          tableName: true,
          recordId: true,
          userId: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              email: true
            }
          }
        },
        orderBy: {
          id: 'desc', // Utiliser l'ID au lieu de createdAt pour éviter le tri complexe
        },
        take: 50, // Réduire encore plus
        skip: 0,
      });
    } catch (error) {
      console.error('Error in findAllAudits:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch audits: ${errorMessage}`);
    }
  }

  async findAuditById(id: number) {
    return this.prisma.audit.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  }

  // Méthode spécifique pour les audits Lighthouse (temporairement désactivée)
  async findLighthouseAudits() {
    try {
      await this.prisma.$connect();
      
      return await this.prisma.audit.findMany({
        select: {
          id: true,
          action: true,
          tableName: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              email: true
            }
          }
        },
        orderBy: {
          id: 'desc',
        },
        take: 20,
      });
    } catch (error) {
      console.error('Error in findLighthouseAudits:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch lighthouse audits: ${errorMessage}`);
    }
  }
}

export default new PrismaService(); 