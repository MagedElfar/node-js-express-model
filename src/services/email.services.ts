import config from "../config";
import { SendEmailDto } from "../dto/email.dto";
import nodemailer, { Transporter } from "nodemailer"
import { InternalServerError } from "../utility/errors";
import { Logger } from "../utility/logger";

export interface IEmailServices {
    send(sendEmailDto: SendEmailDto): Promise<boolean>
}

interface IEmailDetails {
    from: string;
    to: string,
    subject: string;
    data?: string,
    html?: string
}

export default class NodeMailerServices implements IEmailServices {

    private transporter: Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.email.user,
                pass: config.email.password,
            },
            tls: { rejectUnauthorized: false }
        })
    }

    async send(sendEmailDto: SendEmailDto): Promise<boolean> {

        const logger = new Logger()
        return new Promise((resolve, reject) => {

            const mailDetails: IEmailDetails = {
                from: 'admin',
                to: sendEmailDto.to,
                subject: sendEmailDto.subject,
            };

            if (sendEmailDto.data) mailDetails.data = sendEmailDto.data

            if (sendEmailDto.html) mailDetails.html = sendEmailDto.html;

            this.transporter.sendMail(mailDetails, function (err, data) {
                if (err) {
                    logger.error(`${sendEmailDto.subject} email didn't sent to ${sendEmailDto.to}`, null, err);
                    reject(new InternalServerError("Sent Email error"))
                } else {
                    logger.info(`${sendEmailDto.subject} email sent successfully to ${sendEmailDto.to}`, null);
                    resolve(true)
                }
            })
        })
    }

}