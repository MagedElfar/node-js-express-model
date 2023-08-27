import { CreateProductDto } from "../dto/product.dto";
import { ProductAttributes } from "../models/product.model";
import ProductRepository from "../repositories/product.repository";

export interface IProductServices {
    create(createProductDto: CreateProductDto): Promise<ProductAttributes>;
    findById(id: number): Promise<ProductAttributes | null>;
    delete(id: number): Promise<number>
}

export default class ProductServices implements IProductServices {

    private readonly productRepository: ProductRepository;

    constructor(productRepository: ProductRepository) {
        this.productRepository = productRepository
    }

    async create(createProductDto: CreateProductDto): Promise<ProductAttributes> {
        try {
            const product = await this.productRepository.create(createProductDto)

            const newProduct = await this.findById(product.id)

            return newProduct!
        } catch (error) {
            throw error
        }
    }

    async findById(id: number): Promise<ProductAttributes | null> {
        try {
            const product = await this.productRepository.findById(id)

            return product
        } catch (error) {
            throw error
        }
    }

    async delete(id: number): Promise<number> {
        try {

            const isDeleted = await this.productRepository.delete({ id })

            return isDeleted;
        } catch (error) {
            throw error
        }
    }
}