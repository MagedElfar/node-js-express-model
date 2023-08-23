import { UserAttributes } from './../models/user.model';
import { RestPasswordDto } from './../dto/auth.dto';
import config from "../config";
import { LoginDto, SignupDto } from "../dto/auth.dto";
import { setError } from "../utility/error-format";
import { IJwtServices } from "./jwt.services";
import { IUserServices } from "./user.services";
import * as bcrypt from "bcrypt";
import { IEmailServices } from './email.services';
import { ILogger, Logger } from '../utility/logger';
import { IRefreshTokenServices } from './refreshTokwn.services';

export interface IAuthServices {
    signup(signupDto: SignupDto): Promise<{
        user: UserAttributes, accessToken: string, refreshToken: string
    }>;
    login(loginDto: LoginDto): Promise<{
        user: UserAttributes, accessToken: string, refreshToken: string
    }>;
    logout(token: string): Promise<void>
    refreshToken(token: string): Promise<string>
    restPasswordEmail(email: string): Promise<void>;
    restPassword(restPasswordDto: RestPasswordDto): Promise<UserAttributes | null>;
}

export default class AuthServices implements IAuthServices {

    private readonly userServices: IUserServices;
    private readonly jwtServices: IJwtServices;
    private readonly refreshTokenServices: IRefreshTokenServices
    private readonly emailServices: IEmailServices
    private readonly logger: ILogger

    constructor(
        userServices: IUserServices,
        jwtServices: IJwtServices,
        refreshTokenServices: IRefreshTokenServices,
        emailServices: IEmailServices,
        logger: ILogger
    ) {
        this.userServices = userServices;
        this.jwtServices = jwtServices;
        this.refreshTokenServices = refreshTokenServices;
        this.emailServices = emailServices;
        this.logger = logger
    }


    async signup(signupDto: SignupDto): Promise<{
        user: UserAttributes, accessToken: string, refreshToken: string
    }> {
        try {
            let user = await this.userServices.findOne({ email: signupDto.email });

            if (user) throw setError(400, "email is already used");

            const password = await bcrypt.hash(signupDto.password, 10);

            user = await this.userServices.createUser({
                ...signupDto,
                password
            })

            const accessToken: string = this.jwtServices.createToken({ id: user.id }, config.jwt.expire)

            const refreshToken = await this.refreshTokenServices.createToken({
                userId: user.id
            })

            return {
                user,
                accessToken,
                refreshToken: refreshToken.token
            }
        } catch (error) {
            throw error
        }
    }

    async login(loginDto: LoginDto): Promise<{
        user: UserAttributes, accessToken: string, refreshToken: string
    }> {
        try {
            const user = await this.userServices.findOne({ email: loginDto.email });
            if (!user) throw setError(401, "Invalid Email or Password")

            const isSame = await bcrypt.compare(loginDto.password, user.password)
            if (!isSame) throw setError(401, "Invalid Email or Password")

            const accessToken: string = this.jwtServices.createToken({ id: user.id }, config.jwt.expire)

            const refreshToken = await this.refreshTokenServices.createToken({
                userId: user.id
            })
            return {
                user,
                accessToken,
                refreshToken: refreshToken.token
            }
        } catch (error) {
            throw error
        }
    }

    async refreshToken(token: string): Promise<string> {
        try {

            const refreshToken = await this.refreshTokenServices.findOne({ token });


            if (!refreshToken) throw setError(401, "Authentication failed. Token is invalid or expired.");

            const tokenData = this.jwtServices.verifyToken(refreshToken.token);

            if (!tokenData) throw setError(401, "Authentication failed. Token is invalid or expired.");

            const accessToken: string = this.jwtServices.createToken({ id: tokenData.id }, config.jwt.expire)

            return accessToken;
        } catch (error) {
            throw error
        }
    }

    async logout(token: string): Promise<void> {
        try {

            const refreshToken = await this.refreshTokenServices.findOne({ token });


            if (!refreshToken) return;

            await this.refreshTokenServices.deleteOne(refreshToken.id)

            return;
        } catch (error) {
            throw error
        }
    }

    async restPasswordEmail(email: string) {
        try {



            const user = await this.userServices.findOne({ email });

            if (!user) throw setError(404, "doesn't user match this email");

            const token: string = this.jwtServices.createToken({ id: user.id }, "15m")

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

    async restPassword(restPasswordDto: RestPasswordDto): Promise<UserAttributes | null> {
        try {
            const token = this.jwtServices.verifyToken(restPasswordDto.token);

            if (!token) throw (setError(401, "Invalid or Expire token"));

            let user = await this.userServices.findUserById(token.id);

            if (!user) throw setError(400, "doesn't user match this email");

            const password = await bcrypt.hash(restPasswordDto.password, 10);

            user = await this.userServices.updateOne(user.id, { password })

            this.logger.info('rest password', null, {
                name: user?.name,
                email: user?.email
            })

            return user;
        } catch (error) {
            throw error
        }
    }
}