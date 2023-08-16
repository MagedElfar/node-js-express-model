import config from "../config";
import jwt from "jsonwebtoken";

interface ITokenPayload { id: number };

export interface IJwtServices {
    createToken(payload: ITokenPayload, expiresIn: string): string;
}

export default class JwtServices implements IJwtServices {

    private readonly secret: string;

    constructor() {
        this.secret = config.jwt.secret
    }


    createToken(payload: ITokenPayload, expiresIn: string): string {
        return jwt.sign(payload, this.secret, { expiresIn })
    }

}