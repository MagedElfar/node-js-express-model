// src/middleware/authMiddleware.ts
import passport from "passport";
import { Request, Response, NextFunction } from "express";
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import UserServices, { IUserServices } from "../services/user.services";
import { UserAttributes } from "../models/user.model";
import config from "../config";
import { setError } from "../utility/error-format";
import UserRepository from "../repositories/user.repository";

class AuthMiddleware {
    private jwtOptions: StrategyOptions;
    private userServices: IUserServices;

    constructor(userServices: IUserServices) {
        this.jwtOptions = {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.jwt.secret,
        };

        this.userServices = userServices;
        passport.use(new JwtStrategy(this.jwtOptions, this.verifyUser.bind(this)));
    }

    private async verifyUser(jwtPayload: any, done: (error: any, user?: UserAttributes | false) => void) {
        try {
            // Find the user based on the JWT payload (e.g., user ID)
            const user = await this.userServices.findUserById(jwtPayload.id);

            if (user) {
                // If the user is found, attach it to the request object
                return done(null, user);
            } else {
                // If the user is not found, return false (user not authenticated)
                return done(null, false);
            }
        } catch (error) {
            return done(error, false);
        }
    }

    public authenticate(req: Request, res: Response, next: NextFunction) {
        passport.authenticate("jwt", { session: false }, (err: any, user: UserAttributes | undefined, info: any) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                next(setError(401, "Authentication failed. Token is invalid or expired."))
            }
            req.user = user;
            next();
        })(req, res, next);
    }
}


const authMiddleware = new AuthMiddleware(new UserServices(new UserRepository()))

export default authMiddleware