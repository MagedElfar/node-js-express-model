import UserRepository from '../repositories/user.repository';
import UserServices from '../services/user.services';
import { UserController } from '../controllers/user.controllers';
import { Router } from "express"
import permissionMiddleware from '../middlewares/permission.middleware';

const router = Router();

const userController = new UserController(
    new UserServices(new UserRepository())
);

// router.post("/", userController.createUserHandler.bind(userController))

router.get("/:id", userController.getUserByIdHandler.bind(userController))

router.delete("/:id", permissionMiddleware, userController.deleteUserHandler.bind(userController))


export default router;