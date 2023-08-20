// src/controllers/userController.ts
import { NextFunction, Request, Response } from "express";
import { setError } from "../utility/error-format";
import { sendResponse } from "../utility/responseHelpers";
import { IAuthServices } from "../services/auth.services";

export class AuthController {

    private authServices: IAuthServices

    constructor(authServices: IAuthServices) {
        this.authServices = authServices
    }



    async signUpHandler(req: Request, res: Response, next: NextFunction) {

        try {

            const singUpData = await this.authServices.signup(req.body)

            sendResponse(res, {
                ...singUpData
            }, 201)

        } catch (error) {
            next(error)
        }

    }

    async loginHandler(req: Request, res: Response, next: NextFunction) {

        try {

            const loginData = await this.authServices.login(req.body)

            sendResponse(res, {
                ...loginData
            }, 200)

        } catch (error) {
            next(error)
        }

    }

    async restPasswordEmailHandler(req: Request, res: Response, next: NextFunction) {

        try {

            await this.authServices.restPasswordEmail(req.body.email)

            sendResponse(res, {}, 200)

        } catch (error) {
            next(error)
        }

    }

    async restPasswordHandler(req: Request, res: Response, next: NextFunction) {

        try {

            await this.authServices.restPassword({
                password: req.body.password,
                token: req.params.token
            })

            sendResponse(res, {}, 200)

        } catch (error) {
            next(error)
        }

    }

}
