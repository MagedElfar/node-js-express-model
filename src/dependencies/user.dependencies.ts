import { UserController } from "../controllers/user.controllers";
import UserRepository from "../repositories/user.repository";
import UserServices from "../services/user.services";
import DIContainer, { Dependencies } from "../utility/diContainer";
import { Logger } from "../utility/logger";

const userDIContainer = new DIContainer();

userDIContainer.register(Dependencies.Logger, new Logger())

//repository dependencies
userDIContainer.register(Dependencies.UserRepository, new UserRepository());

//services dependencies
userDIContainer.register(Dependencies.UserServices, new UserServices(
    userDIContainer.resolve(Dependencies.UserRepository)
));

//controllers dependencies
userDIContainer.register(Dependencies.UserController, new UserController(
    userDIContainer.resolve(Dependencies.UserServices),
    userDIContainer.resolve(Dependencies.Logger)
))

export default userDIContainer;