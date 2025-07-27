import { Request, Response } from "express";
import AuditService from "../services/AuditService";



async function list(req: Request, res: Response) {
    const audits = await AuditService.findAll();
    console.log(audits);
    res.status(200).json(audits);
}

async function read(req: Request, res: Response) {
    const auditId = req.params.id;
    const audit = await AuditService.findById(auditId);
    if (!audit) {
        return res.status(404).json({ message: "Audit not found" });
    }
    
    res.status(200).json(audit);
}

async function create(req: Request, res: Response) {
    const audit = await AuditService.create(req.body);
    res.status(201).json(audit);
}

async function update(req: Request, res: Response) {
    const auditId = req.params.id;
    const audit = await AuditService.update(auditId, req.body);
    if (!audit) {
        return res.status(404).json({ message: "Audit not found" });
    }
    
    res.status(200).json(audit);
}

async function remove(req: Request, res: Response) {
    try {
        const auditId = req.params.id;
        const deleted = await AuditService.delete(auditId);
        
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: "Audit not found" });
        }
    } catch (error) {
        console.error("Error in remove:", error);
        res.status(500).json({ error: "Failed to delete audit" });
    }
}

export default {
    list,
    create,
    read,
    update,
    remove,
}