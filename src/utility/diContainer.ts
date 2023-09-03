import { Logger } from "winston";
import RefreshTokenRepository from "../repositories/refreshToken.repository";
import UserRepository from "../repositories/user.repository";
import AuthServices from "../services/auth.services";
import NodeMailerServices from "../services/email.services";
import JwtServices from "../services/jwt.services";
import RefreshTokenServices from "../services/refreshTokwn.services";
import UserServices from "../services/user.services";
import ProductServices from "../services/product.services";
import ProductRepository from "../repositories/product.repository";
import ProductMediaRepository from "../repositories/productMedia.repository";
import CloudStorageService from "../services/cloudeStorge.services";
import ProductMediaServices from "../services/productMedia.services";
import { AuthController } from "../controllers/auth.controllers";
import { UserController } from "../controllers/user.controllers";
import { ProductController } from "../controllers/product.controllers";

export enum Dependencies {
    Logger = "logger",
    EmailServices = "emailServices",
    StorageServices = "storageServices",
    UserRepository = "userRepository",
    RefreshTokenRepository = "refreshTokenRepository",
    ProductRepository = "productRepository",
    ProductMediaRepository = "productMediaRepository",
    JwtServices = "JwtServices",
    RefreshTokenServices = "refreshTokenServices",
    UserServices = "userServices",
    AuthServices = "authServices",
    ProductServices = "productServices",
    ProductMediaServices = "productMediaServices",
    AuthController = "authController",
    UserController = "userController",
    ProductController = "productController"
}

// diContainer.js
export default class DIContainer {
    private dependencies: any
    constructor() {
        this.dependencies = {};
    }

    register<T>(key: string, dependency: T): void {
        this.dependencies[key] = dependency;
    }

    resolve<T>(key: string): T {
        if (this.dependencies[key]) {
            return this.dependencies[key];
        }
        throw new Error(`Dependency not found for key: ${key}`);
    }
}

// const dIContainer = DIContainer.createInstance();

// //register dependencies
// dIContainer.register(Dependencies.Logger, new Logger());

// dIContainer.register(Dependencies.EmailServices, new NodeMailerServices());

// dIContainer.register(Dependencies.StorageServices, new CloudStorageService(dIContainer.resolve(Dependencies.Logger)));


// //repository dependencies
// dIContainer.register(Dependencies.UserRepository, new UserRepository());

// dIContainer.register(Dependencies.RefreshTokenRepository, new RefreshTokenRepository());

// dIContainer.register(Dependencies.ProductRepository, new ProductRepository());

// dIContainer.register(Dependencies.ProductMediaRepository, new ProductMediaRepository());

// //services dependencies
// dIContainer.register(Dependencies.JwtServices, new JwtServices());

// dIContainer.register(Dependencies.RefreshTokenServices, new RefreshTokenServices(
//     dIContainer.resolve(Dependencies.RefreshTokenRepository),
//     dIContainer.resolve(Dependencies.JwtServices)
// ))

// dIContainer.register(Dependencies.UserServices, new UserServices(dIContainer.resolve(Dependencies.UserRepository)));

// dIContainer.register(Dependencies.AuthServices, new AuthServices(
//     dIContainer.resolve(Dependencies.UserServices),
//     dIContainer.resolve(Dependencies.JwtServices),
//     dIContainer.resolve(Dependencies.RefreshTokenServices),
//     dIContainer.resolve(Dependencies.EmailServices),
//     dIContainer.resolve(Dependencies.Logger)
// ));


// dIContainer.register(Dependencies.ProductServices, new ProductServices(dIContainer.resolve(Dependencies.ProductRepository)))

// dIContainer.register(Dependencies.ProductMediaServices, new ProductMediaServices(
//     dIContainer.resolve(Dependencies.ProductMediaRepository),
//     dIContainer.resolve(Dependencies.StorageServices)
// ));


// //controllers dependencies
// dIContainer.register(Dependencies.AuthController, new AuthController(
//     dIContainer.resolve(Dependencies.AuthServices),
//     dIContainer.resolve(Dependencies.Logger)
// ))

// dIContainer.register(Dependencies.UserController, new UserController(
//     dIContainer.resolve(Dependencies.UserServices),
//     dIContainer.resolve(Dependencies.Logger)
// ))

// dIContainer.register(Dependencies.ProductController, new ProductController(
//     dIContainer.resolve(Dependencies.ProductServices),
//     dIContainer.resolve(Dependencies.ProductMediaServices)
// ))
// export default dIContainer