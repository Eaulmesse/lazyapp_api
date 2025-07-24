"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditModel = void 0;
const mongoose_1 = require("mongoose");
const AuditSchema = new mongoose_1.Schema({
    url: { type: String, required: true },
    timestamp: { type: Date, default: Date.now, required: true },
    scorePerformance: { type: Number, min: 0, max: 100 },
    scoreAccessibility: { type: Number, min: 0, max: 100 },
    scoreBestPractices: { type: Number, min: 0, max: 100 },
    scoreSEO: { type: Number, min: 0, max: 100 },
    scorePWA: { type: Number, min: 0, max: 100 },
    metrics: {
        firstContentfulPaint: { type: Number },
        largestContentfulPaint: { type: Number },
        cumulativeLayoutShift: { type: Number },
        speedIndex: { type: Number },
        totalBlockingTime: { type: Number },
        timeToInteractive: { type: Number },
    },
    opportunities: [{
            title: { type: String },
            description: { type: String },
            impact: { type: Number },
        }],
    diagnostics: [{
            title: { type: String },
            description: { type: String },
        }],
    recommendationsIA: [{
            summary: { type: String },
            details: { type: String },
            actionableSteps: [{ type: String }],
            severity: { type: String, enum: ['low', 'medium', 'high'] },
            source: { type: String, enum: ['Lighthouse', 'IA'] },
        }],
    rawLighthouseReport: { type: Object }, // Stocke le JSON brut
}, { timestamps: true }); // Ajoute createdAt et updatedAt automatiquement
exports.AuditModel = (0, mongoose_1.model)("Audit", AuditSchema);
