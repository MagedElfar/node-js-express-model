import { AuthController } from '../controllers/auth.controllers';
import { Router } from "express";
import * as authValidations from "./../validations/auth.validations";
import validation from "./../middlewares/validation.middleware"
import authMiddleware from '../middlewares/auth.middleware';
import { Dependencies } from '../utility/diContainer';
import authDIContainer from '../dependencies/auth.dependencies';

const router = Router();


// const authController = new AuthController(
//     new AuthServices(
//         new UserServices(new UserRepository()),
//         new JwtServices(),
//         new RefreshTokenServices(new RefreshTokenRepository(), new JwtServices()),
//         new NodeMailerServices(),
//         new Logger()
//     ),
//     new Logger()
// );

const authController: AuthController = authDIContainer.resolve(Dependencies.AuthController);


router.post("/signup", validation(authValidations.signupSchema), authController.signUpHandler.bind(authController))

router.post("/login", validation(authValidations.loginSchema), authController.loginHandler.bind(authController))

router.post("/logout", authMiddleware.authenticate, validation(authValidations.refreshTokenSchema), authController.logoutHandler.bind(authController))

router.post("/refresh-token", validation(authValidations.refreshTokenSchema), authController.refreshTokenHandler.bind(authController))

router.post("/rest-password", validation(authValidations.restPasswordEmailSchema), authController.restPasswordEmailHandler.bind(authController))

router.post("/rest-password/:token", validation(authValidations.restPasswordSchema), authController.restPasswordHandler.bind(authController))


export default router; 