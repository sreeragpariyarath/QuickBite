import { Logger, Module } from '@nestjs/common';
import { SMS_PROVIDER } from './sms.provider';
import { Msg91SmsProvider } from './msg91-sms.provider';
import { ConsoleSmsProvider } from './console-sms.provider';

@Module({
  providers: [
    {
      provide: SMS_PROVIDER,
      useFactory: () => {
        if (process.env.MSG91_AUTH_KEY && process.env.MSG91_TEMPLATE_ID) {
          return new Msg91SmsProvider();
        }
        new Logger('SmsModule').warn(
          'MSG91_AUTH_KEY/MSG91_TEMPLATE_ID not set — using console SMS provider (OTP is logged, not sent)',
        );
        return new ConsoleSmsProvider();
      },
    },
  ],
  exports: [SMS_PROVIDER],
})
export class SmsModule {}
