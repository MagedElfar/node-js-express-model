import { Request } from "express";
import { CreateProductMediaDto } from "../dto/productMedia.dto";
import { ProductMediaAttributes } from "../models/productMedia.model";
import ProductMediaRepository from "../repositories/productMedia.repository";
import { ICloudStorageService } from "./cloudeStorge.services";

export interface IProductMediaServices {
    create(req: Request, productId: number, isMain: boolean): Promise<ProductMediaAttributes | null>;
    findById(id: number): Promise<ProductMediaAttributes | null>;
    delete(id: number): Promise<number>;
}

export default class ProductMediaServices implements IProductMediaServices {

    private readonly productMediaRepository: ProductMediaRepository
    private readonly cloudStorage: ICloudStorageService

    constructor(
        productMediaRepository: ProductMediaRepository,
        cloudStorage: ICloudStorageService
    ) {
        this.productMediaRepository = productMediaRepository;
        this.cloudStorage = cloudStorage
    }

    async create(req: Request, productId: number, isMain: boolean = false): Promise<ProductMediaAttributes | null> {
        try {

            if (!req.file) return null;

            const cloud = await this.cloudStorage.upload(req.file!, "products")

            const createProductMediaDto: CreateProductMediaDto = {
                image_url: cloud.url,
                storage_key: cloud.public_id,
                productId,
                isMain
            }
            const media = await this.productMediaRepository.create(createProductMediaDto)

            return media
        } catch (error) {
            throw error
        }
    }

    async findById(id: number): Promise<ProductMediaAttributes | null> {
        try {
            const media = await this.productMediaRepository.findById(id)

            if (!media) return null;

            return media

        } catch (error) {
            throw error
        }
    }


    async delete(id: number): Promise<number> {
        try {

            const media = await this.findById(id);

            if (media) await this.cloudStorage.delete(media.storage_key)
            const isDeleted = await this.productMediaRepository.delete({ id })

            return isDeleted;
        } catch (error) {
            throw error
        }
    }

}