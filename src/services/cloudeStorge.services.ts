import config from "../config";
import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import { ILogger } from "../utility/logger";
import { v4 as uuidv4 } from 'uuid';

export interface ICloudStorageService {
    upload(file: Express.Multer.File, folder: string): Promise<any>;
    delete(public_id: string): Promise<any>
}

export default class CloudStorageService implements ICloudStorageService {
    private readonly logger: ILogger

    constructor(logger: ILogger) {
        this.logger = logger;
        cloudinary.config({
            api_key: config.cloud.apiKey,
            api_secret: config.cloud.apiSecret,
            cloud_name: config.cloud.cloudName
        })
    }


    async upload(file: Express.Multer.File, folder: string): Promise<UploadApiResponse | undefined> {
        const newFileName = `${uuidv4()}-${file.originalname}`; // Generate a new filename

        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({
                resource_type: 'auto',
                public_id: `${folder}/${newFileName}`
            }, (error, result) => {
                if (error) {
                    this.logger.error("cloudinary error:", null, { error })
                    reject(error)
                    return;
                }
                this.logger.info('Cloudinary response:', null, result);
                result
                return resolve(result)
            }).end(file.buffer);
        })
    }


    async delete(public_id: string) {
        try {
            await cloudinary.uploader.destroy(public_id)
        } catch (error) {
            this.logger.error("cloudinary error:", null, { error })
            throw error
        }
    }
}