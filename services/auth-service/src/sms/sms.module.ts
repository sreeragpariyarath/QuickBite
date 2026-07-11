import { Logger, Module } from '@nestjs/common';
import { SMS_PROVIDER } from './sms.provider';
import { Msg91SmsProvider } from './msg91-sms.provider';
import { ConsoleSmsProvider } from './console-sms.provider';

@Module({
  providers: [
    {
      provide: SMS_PROVIDER,
      useFactory: () => {
        if (process.env.MSG91_AUTH_KEY) {
          const mode = process.env.MSG91_TEMPLATE_ID
            ? 'DLT template'
            : 'MSG91 default template (trial — delivers to your verified number only)';
          new Logger('SmsModule').log(`SMS via MSG91 SendOTP API — ${mode}`);
          return new Msg91SmsProvider();
        }
        new Logger('SmsModule').warn(
          'MSG91_AUTH_KEY not set — using console SMS provider (OTP is logged, not sent)',
        );
        return new ConsoleSmsProvider();
      },
    },
  ],
  exports: [SMS_PROVIDER],
})
export class SmsModule {}
