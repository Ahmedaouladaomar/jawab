import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  public sendMail(to: string, subject: string, html: string): void {
    this.mailerService
      .sendMail({
        to: to, // list of receivers
        from: 'noreply@jawab.com', // sender address
        subject: subject, // Subject line
        html: html // HTML body content
      })
      .then(() => {console.log('ok')})
      .catch((error) => {console.log(error)});
  }
}