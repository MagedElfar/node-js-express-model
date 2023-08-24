// src/controllers/userController.ts
import { NextFunction, Request, Response } from "express";
import { setError } from "../utility/error-format";
import { sendResponse } from "../utility/responseHelpers";
import { IAuthServices } from "../services/auth.services";
import { ILogger } from "../utility/logger";

export class AuthController {

    private authServices: IAuthServices
    private logger: ILogger

    constructor(
        authServices: IAuthServices,
        logger: ILogger
    ) {
        this.authServices = authServices;
        this.logger = logger
    }



    async signUpHandler(req: Request, res: Response, next: NextFunction) {

        try {

            const singUpData = await this.authServices.signup(req.body)

            this.logger.info("new user signup", null, {
                user: {
                    name: singUpData.user.name,
                    email: singUpData.user.email
                }
            })

            sendResponse(res, {
                ...singUpData
            }, 201)

        } catch (error) {
            this.logger.error(`signup failed`, null, {
                user: {
                    email: req.body.email
                },
                error: error
            })
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

    async logoutHandler(req: Request, res: Response, next: NextFunction) {

        try {

            await this.authServices.logout(req.body.token)

            sendResponse(res, {}, 200)

        } catch (error) {
            next(error)
        }

    }

    async refreshTokenHandler(req: Request, res: Response, next: NextFunction) {

        try {

            const accessToken = await this.authServices.refreshToken(req.body.token)

            sendResponse(res, {
                accessToken
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
