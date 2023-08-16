import { Request, Response, NextFunction } from "express";
import { setError } from "../utility/error-format";
import User from "../models/user.model";


export default function permissionMiddleware(req: Request, res: Response, next: NextFunction) {
    const user = req.user as User; // Cast req.user to User type

    if (req.user?.id !== +req.params.id) return next(setError(403, "Forbidden"))

    next()
}