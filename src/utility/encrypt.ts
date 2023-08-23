import * as crypto from "crypto";
import config from "../config";
import { Logger } from "./logger";

const IV_LENGTH = 16;

const logger = new Logger();

// Use your actual encryption key here
// const encryptionKey = crypto.randomBytes(16);

// // Convert the buffer to a hexadecimal string
// const encryptionKeyHex = encryptionKey.toString('hex');

// console.log('Generated Encryption Key:', encryptionKeyHex);
export function encrypt(text: string): string {
    try {
        const iv = crypto.randomBytes(IV_LENGTH);

        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(config.server.encryptionKey), iv);
        const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    } catch (error) {
        logger.error('Encryption error:', null, error);
        throw error;
    }
}

export function decrypt(text: string): string {
    const parts = text.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = Buffer.from(parts[1], 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(config.server.encryptionKey), iv);
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
    return decrypted.toString();
}
