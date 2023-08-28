import UserRepository from '../repositories/user.repository';
import UserServices from '../services/user.services';
import { UserController } from '../controllers/user.controllers';
import { Router } from "express"
import permissionMiddleware from '../middlewares/permission.middleware';
import * as userValidation from "./../validations/user.validations"
import validation from "./../middlewares/validation.middleware"
import { Logger } from '../utility/logger';

const router = Router();

const userController = new UserController(
    new UserServices(new UserRepository()),
    new Logger()
);

// const userController: UserController = dIContainer.resolve(Dependencies.UserController)


// router.post("/", userController.createUserHandler.bind(userController))

router.get("/:id", userController.getUserByIdHandler.bind(userController))

router.put("/:id", validation(userValidation.updateSchema), userController.updateUserHandler.bind(userController))

router.delete("/:id", permissionMiddleware, userController.deleteUserHandler.bind(userController))


export default router;