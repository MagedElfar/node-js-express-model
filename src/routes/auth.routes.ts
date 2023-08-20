import { AuthController } from '../controllers/auth.controllers';
import UserRepository from '../repositories/user.repository';
import AuthServices from '../services/auth.services';
import JwtServices from '../services/jwt.services';
import UserServices from '../services/user.services';
import { Router } from "express";
import * as authValidations from "./../validations/auth.validations";
import validation from "./../middlewares/validation.middleware"
import NodeMailerServices from '../services/email.services';

const router = Router();

const authController = new AuthController(
    new AuthServices(
        new UserServices(new UserRepository()),
        new JwtServices(),
        new NodeMailerServices()
    )
);

router.post("/signup", validation(authValidations.signupSchema), authController.signUpHandler.bind(authController))

router.post("/login", validation(authValidations.loginSchema), authController.loginHandler.bind(authController))

router.post("/rest-password", validation(authValidations.restPasswordEmailSchema), authController.restPasswordEmailHandler.bind(authController))

router.post("/rest-password/:token", validation(authValidations.restPasswordSchema), authController.restPasswordHandler.bind(authController))


export default router; 