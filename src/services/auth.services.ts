import { RestPasswordDto } from './../dto/auth.dto';
import config from "../config";
import { LoginDto, SignupDto } from "../dto/auth.dto";
import { UserAttributes } from "../models/user.model";
import { setError } from "../utility/error-format";
import { IJwtServices } from "./jwt.services";
import { IUserServices } from "./user.services";
import * as bcrypt from "bcrypt";
import { IEmailServices } from './email.services';
import { Logger } from '../utility/logger';

export interface IAuthServices {
    signup(signupDto: SignupDto): Promise<{ user: UserAttributes, accessToken: string }>;
    login(loginDto: LoginDto): Promise<{ user: UserAttributes, accessToken: string }>;
    restPasswordEmail(email: string): Promise<void>;
    restPassword(restPasswordDto: RestPasswordDto): Promise<void>;
}

export default class AuthServices implements IAuthServices {

    private readonly userServices: IUserServices;
    private readonly jwtServices: IJwtServices;
    private readonly emailServices: IEmailServices

    constructor(
        userServices: IUserServices,
        jwtServices: IJwtServices,
        emailServices: IEmailServices
    ) {
        this.userServices = userServices;
        this.jwtServices = jwtServices;
        this.emailServices = emailServices
    }


    async signup(signupDto: SignupDto): Promise<{ user: UserAttributes, accessToken: string }> {
        try {
            let user = await this.userServices.findOne({ email: signupDto.email });

            if (user) throw setError(400, "email is already used");

            const password = await bcrypt.hash(signupDto.password, 10);

            user = await this.userServices.createUser({
                ...signupDto,
                password
            })

            const accessToken: string = this.jwtServices.createToken({ id: user.id }, config.jwt.expire)

            return {
                user,
                accessToken
            }
        } catch (error) {
            throw error
        }
    }

    async login(loginDto: LoginDto): Promise<{ user: UserAttributes, accessToken: string }> {
        try {
            const user = await this.userServices.findOne({ email: loginDto.email });
            if (!user) throw setError(401, "Invalid Email or Password")

            const isSame = await bcrypt.compare(loginDto.password, user.password)
            if (!isSame) throw setError(401, "Invalid Email or Password")

            const accessToken: string = this.jwtServices.createToken({ id: user.id }, config.jwt.expire)

            return {
                user,
                accessToken
            }
        } catch (error) {
            throw error
        }
    }

    async restPasswordEmail(email: string) {
        try {



            const user = await this.userServices.findOne({ email });

            if (!user) throw setError(404, "doesn't user match this email");

            const token: string = this.jwtServices.createToken({ id: user.id }, "15m")

            console.log("token = ", token)

            await this.emailServices.send({
                to: email,
                subject: "Forget Password",
                html: `
                <h3>Please click on the link blow to rest your password</h3>
                <a href = "/forgot-password?token=${token}">Rest Password</a>
            `
            });

            return

        } catch (error) {
            throw error
        }
    }

    async restPassword(restPasswordDto: RestPasswordDto) {
        try {
            const token = this.jwtServices.verifyToken(restPasswordDto.token, 403);

            const user = await this.userServices.findUserById(token.id);

            if (!user) throw setError(400, "doesn't user match this email");

            const password = await bcrypt.hash(restPasswordDto.password, 10);

            await this.userServices.updateOne(user.id, { password })

            const logger = new Logger()

            logger.info('rest password', null, {
                name: user?.name,
                email: user?.email
            })

            return;
        } catch (error) {
            throw error
        }
    }
}