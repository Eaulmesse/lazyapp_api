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
    return this.prisma.audit.create({
      data: auditData,
    });
  }

  async findAllAudits() {
    return this.prisma.audit.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findAuditById(id: number) {
    return this.prisma.audit.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  }
}

export default new PrismaService(); 