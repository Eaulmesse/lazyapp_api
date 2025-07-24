import express from "express";
import router from "express";
import auditRoutes from "./audit";
import userRoutes from "./user";

const appRouter = express.Router();

appRouter.use("/audit", auditRoutes);
appRouter.use("/user", userRoutes);

export default appRouter;