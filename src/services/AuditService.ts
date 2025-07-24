import { Audit } from "../entities/Audit";
import { Repository } from "typeorm";
import { AppDataSource } from "../config/database";
import { log } from "console";

class auditService {
  private auditRepository: Repository<Audit>;

  constructor() {
    this.auditRepository = AppDataSource.getRepository(Audit);
  }

  async findAll(): Promise<Audit[]> {
    try {
      return this.auditRepository.find({
        order: {
          createdAt: "DESC",
        },
      });
      
    } catch (error) {
      throw new Error("Failed to fetch audits");
    }
  }

  async findById(id: string): Promise<Audit | null> {
    try {
      return this.auditRepository.findOne({
        where: { id: parseInt(id) },
      });
    } catch (error) {
      throw new Error("Failed to fetch audit by ID");
    }
  }

  async create(auditData: Partial<Audit>): Promise<Audit> {
    try{
      const newAudit = this.auditRepository.create(auditData);
      return this.auditRepository.save(newAudit);
    } catch (error) {
      throw new Error("Failed to create audit");
    }
  }

  async update(id: string, auditData: Partial<Audit>): Promise<Audit | null> {
    try {
      const audit = await this.findById(id);
      if (!audit) {
        return null;
      }
      return this.auditRepository.save({ ...audit, ...auditData });
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
      
      const result = await this.auditRepository.delete(parseInt(id));
      return result.affected !== 0;
    } catch (error) {
      throw new Error("Failed to delete audit");
    }
  }
}



export default new auditService();