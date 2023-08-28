import { Router } from "express"
import { ProductController } from '../controllers/product.controllers';
import ProductServices from '../services/product.services';
import ProductRepository from '../repositories/product.repository';
import * as productValidations from "./../validations/product.validations";
import validation from "./../middlewares/validation.middleware";
import Multer from "../middlewares/multer.middleware";
import ProductMediaServices from "../services/productMedia.services";
import ProductMediaRepository from "../repositories/productMedia.repository";
import CloudStorageService from "../services/cloudeStorge.services";
import { Logger } from "../utility/logger";

const router = Router();

// const multerOptions = {
//     limit: {
//         fileSize: 10 * 1024 * 1024, // 10 MB limit
//     }
// };

const multerInstance = new Multer();

const productController = new ProductController(
    new ProductServices(new ProductRepository()),
    new ProductMediaServices(
        new ProductMediaRepository(),
        new CloudStorageService(new Logger())
    )
);

// const productController: ProductController = dIContainer.resolve(Dependencies.ProductController)


router.post("/", multerInstance.memoryUpload().single("image"), validation(productValidations.createProductSchema), productController.createProductHandler.bind(productController))

router.get("/:id", productController.getProductHandler.bind(productController));

router.delete("/:id", productController.deleteProductHandler.bind(productController));

export default router;