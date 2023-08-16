import config from "../config";
import { LoginDto, SignupDto } from "../dto/auth.dto";
import { UserAttributes } from "../models/user.model";
import { setError } from "../utility/error-format";
import { IJwtServices } from "./jwt.services";
import { IUserServices } from "./user.services";
import * as bcrypt from "bcrypt";

export interface IAuthServices {
    signup(signupDto: SignupDto): Promise<{ user: UserAttributes, accessToken: string }>;
    login(loginDto: LoginDto): Promise<{ user: UserAttributes, accessToken: string }>;

}

export default class AuthServices implements IAuthServices {

    private readonly userServices: IUserServices;
    private readonly jwtServices: IJwtServices

    constructor(
        userServices: IUserServices,
        jwtServices: IJwtServices
    ) {
        this.userServices = userServices;
        this.jwtServices = jwtServices
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

}