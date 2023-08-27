import multer from "multer";
import { v4 as uuidv4 } from 'uuid';
import config from "../config";

export default class Multer {

    localUpload() {
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, config.server.mediaPath);
            },
            filename: (req, file, cb) => {
                const filename = `${uuidv4()}-${file.originalname}`;
                cb(null, filename);
            },
        });

        return multer({ storage });
    }

    memoryUpload() {
        const storage = multer.memoryStorage(); // Configure memory storage

        return multer({ storage });
    }
}