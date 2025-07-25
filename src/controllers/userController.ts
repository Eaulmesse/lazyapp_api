import { Request, Response } from "express";
import UserService from "../services/userService";
import { log } from "node:console";

async function create(req: Request, res: Response) {
    const user = await UserService.create(req.body);
    res.status(201).json(user);
}

async function login(req: Request, res: Response) {
    const user = await UserService.login(req.body);
    res.status(200).json(user);
}

export default {
    create,
    login,
}