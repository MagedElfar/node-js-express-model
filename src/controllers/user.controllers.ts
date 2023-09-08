// src/controllers/userController.ts
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utility/responseHelpers";
import { IUserServices } from "../services/user.services";
import { ILogger } from "../utility/logger";
import { NotFoundError } from "../utility/errors";

export class UserController {

    private userServices: IUserServices
    private logger: ILogger;

    constructor(userServices: IUserServices, logger: ILogger) {
        this.userServices = userServices;
        this.logger = logger
    }

    async getUserByIdHandler(req: Request, res: Response, next: NextFunction) {

        try {
            const { id } = req.params

            const user = await this.userServices.findUserById(+id)

            if (!user) throw new NotFoundError("user doesn't exist")

            sendResponse(res, {
                user
            }, 200)

        } catch (error) {
            next(error)
        }

    }

    async createUserHandler(req: Request, res: Response, next: NextFunction) {

        try {

            const user = await this.userServices.createUser(req.body)

            sendResponse(res, {
                user
            }, 201)

        } catch (error) {
            next(error)
        }

    }

    async updateUserHandler(req: Request, res: Response, next: NextFunction) {

        try {

            const user = await this.userServices.updateUser(+req.params.id!, req.body)

            sendResponse(res, {
                user
            }, 200)

        } catch (error) {
            next(error)
        }

    }

    async deleteUserHandler(req: Request, res: Response, next: NextFunction) {

        try {

            const { id } = req.params

            const user = await this.userServices.findUserById(+id);

            if (!user) throw new NotFoundError("user note exist")

            const isDeleted = await this.userServices.deleteUser(+id);

            if (!isDeleted) throw new NotFoundError("user note exist");

            this.logger.info("delete user", null, {
                user: {
                    name: req.user?.name,
                    email: req.user?.email
                },
                deletedUser: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            })

            sendResponse(res, {}, 200)

        } catch (error) {
            next(error)
        }

    }
}
