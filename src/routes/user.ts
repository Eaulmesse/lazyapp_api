import express, { Request, Response, Router } from "express";
import userController from "../controllers/userController";

const appRouter = express.Router();

appRouter.post("/", (req: Request, res: Response) => {
    userController.create(req, res);
});

appRouter.post("/login", (req: Request, res: Response) => {
    userController.login(req, res);
});

export default appRouter;