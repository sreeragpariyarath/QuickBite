import { Logger, Module } from '@nestjs/common';
import { EMAIL_PROVIDER } from './email.provider';
import { ResendEmailProvider } from './resend-email.provider';
import { ConsoleEmailProvider } from './console-email.provider';

@Module({
  providers: [
    {
      provide: EMAIL_PROVIDER,
      useFactory: () => {
        if (process.env.RESEND_API_KEY) {
          new Logger('EmailModule').log('Email via Resend');
          return new ResendEmailProvider();
        }
        new Logger('EmailModule').warn(
          'RESEND_API_KEY not set — using console email provider (verification URL is logged, not sent)',
        );
        return new ConsoleEmailProvider();
      },
    },
  ],
  exports: [EMAIL_PROVIDER],
})
export class EmailModule {}
