import config from "../config";
import jwt, { verify } from "jsonwebtoken";
import { setError } from "../utility/error-format";
import { Logger } from "../utility/logger";

interface ITokenPayload { id: number };

export interface IJwtServices {
    createToken(payload: ITokenPayload, expiresIn: string): string;
    verifyToken(token: string, code: number): any
}

export default class JwtServices implements IJwtServices {

    private readonly secret: string;

    constructor() {
        this.secret = config.jwt.secret
    }


    createToken(payload: ITokenPayload, expiresIn: string): string {
        return jwt.sign(payload, this.secret, { expiresIn })
    }

    verifyToken(token: string, code: number): any {

        const logger = new Logger()

        try {
            let error: any = null;
            let data: any;

            verify(token, config.jwt.secret!, async (err, decodedData: any) => {
                if (err) {
                    error = err;
                    return;
                }

                data = decodedData
            });
            if (error) {
                logger.error("Jwt error:", null, error)
                throw (setError(code, "Invalid or ExpireToken"));
            }

            return data
        } catch (error) {
            throw error
        }
    }

}