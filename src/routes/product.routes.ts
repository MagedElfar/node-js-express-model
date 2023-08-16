import { Router } from "express"
import { ProductController } from '../controllers/product.controllers';
import ProductServices from '../services/product.services';
import ProductRepository from '../repositories/product.repository';
import * as productValidations from "./../validations/product.validations";
import validation from "./../middlewares/validation.middleware";

const router = Router();

const productController = new ProductController(
    new ProductServices(new ProductRepository())
);

router.post("/", validation(productValidations.createProductSchema), productController.createProductHandler.bind(productController))

router.get("/:id", productController.getProductHandler.bind(productController))

export default router;