import express from "express";
import router from "express";
import auditRoutes from "./Audit";

const appRouter = express.Router();

appRouter.use("/audit", auditRoutes);

export default appRouter;