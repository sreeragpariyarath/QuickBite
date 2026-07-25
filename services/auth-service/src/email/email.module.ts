import { Logger, Module } from '@nestjs/common';
import { EMAIL_PROVIDER } from './email.provider';
import { SmtpEmailProvider } from './smtp-email.provider';
import { ResendEmailProvider } from './resend-email.provider';
import { ConsoleEmailProvider } from './console-email.provider';

@Module({
  providers: [
    {
      provide: EMAIL_PROVIDER,
      useFactory: () => {
        const logger = new Logger('EmailModule');
        
        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
          logger.log('Email via SMTP (Google Gmail)');
          return new SmtpEmailProvider();
        }
        
        if (process.env.RESEND_API_KEY) {
          logger.log('Email via Resend');
          return new ResendEmailProvider();
        }
        
        logger.warn(
          'Neither SMTP credentials nor RESEND_API_KEY set — using console email provider (verification URL is logged, not sent)',
        );
        return new ConsoleEmailProvider();
      },
    },
  ],
  exports: [EMAIL_PROVIDER],
})
export class EmailModule {}
