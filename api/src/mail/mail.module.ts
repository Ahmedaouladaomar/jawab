import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailConfig } from 'src/config/mailConfig';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports:[
    ConfigModule,
    MailerModule.forRootAsync(mailConfig),
  ],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}
