import ProductMedia, { ProductMediaAttributes } from "../models/productMedia.model";
import GenericRepository from "./genericRepository";

export default class ProductMediaRepository extends GenericRepository<ProductMedia, ProductMediaAttributes> {

    constructor() {
        super(ProductMedia)
    }
} 