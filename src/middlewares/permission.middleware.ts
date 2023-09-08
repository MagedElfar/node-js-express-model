import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "../utility/errors";
import User, { Role } from "../models/user.model";


export default function permissionMiddleware(req: Request, res: Response, next: NextFunction) {
    const user = req.user as User; // Cast req.user to User type

    if (req.user?.id !== +req.params.id && user.role !== Role.ADMIN)
        return next(new ForbiddenError("Forbidden"))

    next()
}