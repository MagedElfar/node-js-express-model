// src/helpers/responseHelpers.ts
import { Response } from "express";

export function sendResponse(res: Response, data: any, statusCode: number = 200): void {
    const response = {
        type: "success",
        ...data
    };
    res.status(statusCode).json(response);
}
