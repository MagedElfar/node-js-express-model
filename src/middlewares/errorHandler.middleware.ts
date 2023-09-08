import { Request, Response, NextFunction } from "express";
import { AppError } from "../utility/errors";
import { Logger } from "../utility/logger";

// export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {

//     const logger = new Logger()

//     const error = requestErrorFormat(err)

//     logger.error(`error ocurred ${req.user ? `with user ${req.user.name}` : ""}`, req, {
//         user: req.user ? {
//             name: req.user.name,
//             email: req.user.email
//         } : null,

//         error
//     })

//     res.status(err.status || err.response?.data.code || 500).json(error)
// }

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {

    const logger = new Logger()

    // const error = requestErrorFormat(err)

    console.log(err)


    if (err instanceof AppError) {
        // Handle specific application errors
        res.status(err.status).json({
            type: err.type,
            message: err.message,
            error: err.error
        });

        logger.error(err.message, req, {
            user: req.user ? {
                name: req.user.name,
                email: req.user.email
            } : null,

            error: err.error
        })
    } else {
        // Handle unexpected errors
        res.status(500).json({
            type: "Error",
            message: 'Internal Server Error',
            error: err.message
        });

        logger.error("Internal Server Error", req, {
            user: req.user ? {
                name: req.user.name,
                email: req.user.email
            } : null,

            error: {
                message: err.message,
                stack: err.stack
            }
        })
    }



    // res.status(err.status || err.response?.data.code || 500).json(error)
}