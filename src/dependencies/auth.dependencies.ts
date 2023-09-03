import { AuthController } from "../controllers/auth.controllers";
import RefreshTokenRepository from "../repositories/refreshToken.repository";
import UserRepository from "../repositories/user.repository";
import AuthServices from "../services/auth.services";
import NodeMailerServices from "../services/email.services";
import JwtServices from "../services/jwt.services";
import RefreshTokenServices from "../services/refreshTokwn.services";
import UserServices from "../services/user.services";
import { Logger } from "../utility/logger";
import DIContainer, { Dependencies } from "./../utility/diContainer";

const authDIContainer = new DIContainer();

authDIContainer.register(Dependencies.Logger, new Logger())

//repository dependencies
authDIContainer.register(Dependencies.UserRepository, new UserRepository());
authDIContainer.register(Dependencies.RefreshTokenRepository, new RefreshTokenRepository());

//services dependencies
authDIContainer.register(Dependencies.UserServices, new UserServices(
    authDIContainer.resolve(Dependencies.UserRepository)
));

authDIContainer.register(Dependencies.JwtServices, new JwtServices())

authDIContainer.register(Dependencies.RefreshTokenServices, new RefreshTokenServices(
    authDIContainer.resolve(Dependencies.RefreshTokenRepository),
    authDIContainer.resolve(Dependencies.JwtServices)
))

authDIContainer.register(Dependencies.EmailServices, new NodeMailerServices())

authDIContainer.register(Dependencies.AuthServices, new AuthServices(
    authDIContainer.resolve(Dependencies.UserServices),
    authDIContainer.resolve(Dependencies.JwtServices),
    authDIContainer.resolve(Dependencies.RefreshTokenServices),
    authDIContainer.resolve(Dependencies.EmailServices),
    authDIContainer.resolve(Dependencies.Logger)
))

//controllers dependencies
authDIContainer.register(Dependencies.AuthController, new AuthController(
    authDIContainer.resolve(Dependencies.AuthServices),
    authDIContainer.resolve(Dependencies.Logger)
));

export default authDIContainer;