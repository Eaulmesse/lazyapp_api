import express, { Request, Response, Router } from "express";
import userController from "../controllers/userController";

const appRouter = express.Router();

appRouter.post("/", (req: Request, res: Response) => {
    userController.create(req, res);
});

export default appRouter;