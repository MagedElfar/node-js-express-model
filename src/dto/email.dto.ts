export class SendEmailDto {
    to: string;
    subject: string;
    data?: any
    html?: string
}