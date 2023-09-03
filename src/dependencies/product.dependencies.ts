
import { ProductController } from "../controllers/product.controllers";
import ProductRepository from "../repositories/product.repository";
import ProductMediaRepository from "../repositories/productMedia.repository";
import CloudStorageService from "../services/cloudeStorge.services";
import ProductServices from "../services/product.services";
import ProductMediaServices from "../services/productMedia.services";
import DIContainer, { Dependencies } from "../utility/diContainer";
import { Logger } from "../utility/logger";

const productDIContainer = new DIContainer();

productDIContainer.register(Dependencies.Logger, new Logger());

productDIContainer.register(Dependencies.StorageServices, new CloudStorageService(productDIContainer.resolve(Dependencies.Logger)));

//repository dependencies
productDIContainer.register(Dependencies.ProductRepository, new ProductRepository());
productDIContainer.register(Dependencies.ProductMediaRepository, new ProductMediaRepository());

//services dependencies
productDIContainer.register(Dependencies.ProductServices, new ProductServices(
    productDIContainer.resolve(Dependencies.ProductRepository)
));

productDIContainer.register(Dependencies.ProductMediaServices, new ProductMediaServices(
    productDIContainer.resolve(Dependencies.ProductMediaRepository),
    productDIContainer.resolve(Dependencies.StorageServices)
));

//controllers dependencies
productDIContainer.register(Dependencies.ProductController, new ProductController(
    productDIContainer.resolve(Dependencies.ProductServices),
    productDIContainer.resolve(Dependencies.ProductMediaServices)
))

export default productDIContainer;