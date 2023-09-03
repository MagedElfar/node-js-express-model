import { Router } from "express"
import { ProductController } from '../controllers/product.controllers';
import * as productValidations from "./../validations/product.validations";
import validation from "./../middlewares/validation.middleware";
import Multer from "../middlewares/multer.middleware";
import { Dependencies } from "../utility/diContainer";
import productDIContainer from "../dependencies/product.dependencies";

const router = Router();

// const multerOptions = {
//     limit: {
//         fileSize: 10 * 1024 * 1024, // 10 MB limit
//     }
// };

const multerInstance = new Multer();

// const productController = new ProductController(
//     new ProductServices(new ProductRepository()),
//     new ProductMediaServices(
//         new ProductMediaRepository(),
//         new CloudStorageService(new Logger())
//     )
// );

const productController: ProductController = productDIContainer.resolve(Dependencies.ProductController)


router.post("/", multerInstance.memoryUpload().single("image"), validation(productValidations.createProductSchema), productController.createProductHandler.bind(productController))

router.get("/:id", productController.getProductHandler.bind(productController));

router.delete("/:id", productController.deleteProductHandler.bind(productController));

export default router;