import Product from "../models/product.model";
import User from "../models/user.model";
import GenericRepository from "./genericRepository";

export default class ProductRepository extends GenericRepository<Product> {

    constructor() {
        super(Product)
    }

    public findById(id: number): Promise<Product | null> {
        return this.model.findByPk(id, {
            include: [
                {
                    model: User,
                    attributes: ["id", "name", "email"],
                    as: "user",
                }
            ]
        })
    }

}