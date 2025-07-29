import { Request, Response } from "express";
import AuditService from "../services/AuditService";
import { getUserIdFromHeaders } from "../utils/authUtils";



async function list(req: Request, res: Response) {
    try {
        // Si on demande spécifiquement les audits Lighthouse
        if (req.query.type === 'lighthouse') {
            const audits = await AuditService.findLighthouseAudits();
            res.status(200).json(audits);
        } else {
            // Sinon, récupérer tous les audits (limités)
            const audits = await AuditService.findAll();
            res.status(200).json(audits);
        }
    } catch (error) {
        console.error("Error in list:", error);
        res.status(500).json({ error: "Failed to fetch audits" });
    }
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
    try {
        const { testId, url, results } = req.body;
        
        // Récupérer l'utilisateur depuis la session
        const userId = getUserIdFromHeaders(req);
        
        // Si c'est un résultat Lighthouse
        if (testId && url && results) {
            // Extraire les scores des catégories
            const categories = results.categories || {};
            const scorePerformance = categories.performance?.score;
            const scoreAccessibility = categories.accessibility?.score;
            const scoreBestPractices = categories['best-practices']?.score;
            const scoreSEO = categories.seo?.score;
            const scorePWA = categories.pwa?.score;

            // Extraire les métriques de performance
            const audits = results.audits || {};
            const firstContentfulPaint = audits['first-contentful-paint']?.numericValue;
            const largestContentfulPaint = audits['largest-contentful-paint']?.numericValue;
            const cumulativeLayoutShift = audits['cumulative-layout-shift']?.numericValue;
            const speedIndex = audits['speed-index']?.numericValue;
            const totalBlockingTime = audits['total-blocking-time']?.numericValue;
            const timeToInteractive = audits['interactive']?.numericValue;

            // Extraire les opportunités d'amélioration (essentielles pour l'IA)
            const opportunities = Object.values(audits)
                .filter((audit: any) => audit.details?.type === 'opportunity' && audit.score < 1)
                .map((audit: any) => ({
                    title: audit.title,
                    description: audit.description,
                    impact: audit.numericValue,
                    score: audit.score,
                    details: audit.details || null
                }))
                .slice(0, 10); // Limiter à 10 opportunités principales

            // Extraire les diagnostics techniques (essentiels pour l'IA)
            const diagnostics = Object.values(audits)
                .filter((audit: any) => audit.details?.type === 'diagnostic' && audit.score < 1)
                .map((audit: any) => ({
                    title: audit.title,
                    description: audit.description,
                    score: audit.score,
                    details: audit.details || null
                }))
                .slice(0, 10); // Limiter à 10 diagnostics principaux

            const auditData = {
                action: 'lighthouse_test',
                tableName: 'lighthouse_results',
                testId,
                url,
                timestamp: new Date(),
                // Informations contextuelles pour l'IA
                userAgent: results.userAgent || null,
                deviceType: results.environment?.hostUserAgent?.includes('Mobile') ? 'mobile' : 'desktop',
                scorePerformance,
                scoreAccessibility,
                scoreBestPractices,
                scoreSEO,
                scorePWA,
                firstContentfulPaint,
                largestContentfulPaint,
                cumulativeLayoutShift,
                speedIndex,
                totalBlockingTime,
                timeToInteractive,
                opportunities: opportunities.length > 0 ? opportunities : null,
                diagnostics: diagnostics.length > 0 ? diagnostics : null,
                // Supprimer rawLighthouseReport pour économiser l'espace
                // rawLighthouseReport: results,
                userId: req.user.id
            };

            const audit = await AuditService.create(auditData);
            res.status(201).json(audit);
        } else {
            // Audit normal
            const audit = await AuditService.create(req.body);
            res.status(201).json(audit);
        }
    } catch (error) {
        console.error("Error in create:", error);
        res.status(500).json({ error: "Failed to create audit" });
    }
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