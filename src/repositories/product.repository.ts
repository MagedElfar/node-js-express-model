import Product, { ProductAttributes } from "../models/product.model";
import ProductMedia from "../models/productMedia.model";
import User from "../models/user.model";
import { InternalServerError } from "../utility/errors";
import GenericRepository from "./genericRepository";

export default class ProductRepository extends GenericRepository<Product, ProductAttributes> {

    constructor() {
        super(Product)
    }

    async findById(id: number): Promise<ProductAttributes | null> {
        try {
            const model = await this.model.findByPk(id, {
                include: [
                    {
                        model: User,
                        attributes: ["id", "name", "email"],
                        as: "user",
                    },
                    {
                        model: ProductMedia,
                        // attributes: ["id", "url", "storage_key", "isMain"],
                        as: "media",
                        required: false,
                    },

                ]
            })

            if (!model) return null

            return model.dataValues
        } catch (error) {
            this.logger.error("database error", null, error)
            throw new InternalServerError("database error")
        }
    }
}