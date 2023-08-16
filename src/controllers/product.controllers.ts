import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utility/responseHelpers";
import { IProductServices } from "../services/product.services";
import { setError } from "../utility/error-format";

export class ProductController {

    private productServices: IProductServices

    constructor(productServices: IProductServices) {
        this.productServices = productServices
    }


    async createProductHandler(req: Request, res: Response, next: NextFunction) {

        try {


            const product = await this.productServices.create({
                ...req.body,
                userId: req.user?.id
            })

            sendResponse(res, {
                product
            }, 201)

        } catch (error) {
            next(error)
        }

    }

    async getProductHandler(req: Request, res: Response, next: NextFunction) {

        try {

            const { id } = req.params

            const product = await this.productServices.findById(+id)

            if (!product) throw setError(404, "Product not exists")

            sendResponse(res, {
                product
            }, 200)

        } catch (error) {
            next(error)
        }

    }
}
