import PrismaService from "./PrismaService";

class AuditService {
  async findAll() {
    try {
      return await PrismaService.findAllAudits();
    } catch (error) {
      throw new Error("Failed to fetch audits");
    }
  }

  async findById(id: string) {
    try {
      return await PrismaService.findAuditById(parseInt(id));
    } catch (error) {
      throw new Error("Failed to fetch audit by ID");
    }
  }

  async findLighthouseAudits() {
    try {
      return await PrismaService.findLighthouseAudits();
    } catch (error) {
      throw new Error("Failed to fetch lighthouse audits");
    }
  }

  async create(auditData: {
    action: string;
    tableName: string;
    recordId?: number;
    oldValues?: any;
    newValues?: any;
    userId?: number;
    // Champs pour Lighthouse
    testId?: string;
    url?: string;
    timestamp?: Date;
    scorePerformance?: number;
    scoreAccessibility?: number;
    scoreBestPractices?: number;
    scoreSEO?: number;
    scorePWA?: number;
    firstContentfulPaint?: number;
    largestContentfulPaint?: number;
    cumulativeLayoutShift?: number;
    speedIndex?: number;
    totalBlockingTime?: number;
    timeToInteractive?: number;
    opportunities?: any;
    diagnostics?: any;
    recommendationsIA?: any;
    rawLighthouseReport?: any;
  }) {
    try {
      // Si c'est un résultat Lighthouse, utiliser le client Prisma directement
      if (auditData.testId && auditData.url) {
        return await PrismaService.client.audit.create({
          data: auditData
        });
      }
      
      // Sinon, utiliser la méthode existante pour les audits normaux
      return await PrismaService.createAudit(auditData);
    } catch (error) {
      throw new Error("Failed to create audit");
    }
  }

  async update(id: string, auditData: Partial<{
    action: string;
    tableName: string;
    recordId?: number;
    oldValues?: any;
    newValues?: any;
    userId?: number;
  }>) {
    try {
      const audit = await this.findById(id);
      if (!audit) {
        return null;
      }
      return await PrismaService.client.audit.update({
        where: { id: parseInt(id) },
        data: auditData,
      });
    } catch (error) {
      throw new Error("Failed to update audit");
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const audit = await this.findById(id);
      if (!audit) {
        return false;
      }
      
      await PrismaService.client.audit.delete({
        where: { id: parseInt(id) },
      });
      return true;
    } catch (error) {
      throw new Error("Failed to delete audit");
    }
  }
}

export default new AuditService();