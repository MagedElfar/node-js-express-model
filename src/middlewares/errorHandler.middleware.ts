import { Request, Response, NextFunction } from "express";
import { requestErrorFormat } from "../utility/error-format";
import { Logger } from "../utility/logger";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {

    const logger = new Logger()

    logger.error(`error ocurred ${req.user ? `with user ${req.user.name}` : ""}`, req, err)

    const error = requestErrorFormat(err)
    res.status(err.status || err.response?.data.code || 500).json(error)
}