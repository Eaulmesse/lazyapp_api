import express, { Request, Response } from "express";

const router = express.Router();
const auditController = require("../controllers/Audit");

router.get("/", (req: Request, res: Response) => {});



export default router;