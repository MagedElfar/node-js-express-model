// src/controllers/userController.ts
import { NextFunction, Request, Response } from "express";
import { setError } from "../utility/error-format";
import { sendResponse } from "../utility/responseHelpers";
import { IUserServices } from "../services/user.services";

export class UserController {

    private userServices: IUserServices

    constructor(userServices: IUserServices) {
        this.userServices = userServices
    }

    async getUserByIdHandler(req: Request, res: Response, next: NextFunction) {

        try {
            const { id } = req.params

            const user = await this.userServices.findUserById(+id)

            if (!user) throw setError(404, "user doesn't exist")

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

            await this.userServices.deleteUser(+id)


            sendResponse(res, {}, 200)

        } catch (error) {
            next(error)
        }

    }
}
