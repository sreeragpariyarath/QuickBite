import { Logger, Module } from '@nestjs/common';
import { SMS_PROVIDER } from './sms.provider';
import { Msg91SmsProvider } from './msg91-sms.provider';
import { ConsoleSmsProvider } from './console-sms.provider';
import { RoutingSmsProvider } from './routing-sms.provider';

@Module({
  providers: [
    {
      provide: SMS_PROVIDER,
      useFactory: () => {
        const logger = new Logger('SmsModule');

        if (!process.env.MSG91_AUTH_KEY) {
          logger.warn(
            'MSG91_AUTH_KEY not set — using console SMS provider (OTP is logged, not sent)',
          );
          return new ConsoleSmsProvider();
        }

        const liveNumbers = (process.env.SMS_LIVE_NUMBERS ?? '')
          .split(',')
          .map((n) => n.trim())
          .filter(Boolean);

        if (liveNumbers.length > 0) {
          logger.log(
            `SMS via MSG91 for [${liveNumbers.join(', ')}]; dev fallback (devOtp) for all other numbers`,
          );
          return new RoutingSmsProvider(
            new Msg91SmsProvider(),
            new ConsoleSmsProvider(),
            liveNumbers,
          );
        }

        const mode = process.env.MSG91_TEMPLATE_ID
          ? 'DLT template'
          : 'MSG91 default template (trial — delivers to your verified number only)';
        logger.log(`SMS via MSG91 SendOTP API for ALL numbers — ${mode}`);
        return new Msg91SmsProvider();
      },
    },
  ],
  exports: [SMS_PROVIDER],
})
export class SmsModule {}
