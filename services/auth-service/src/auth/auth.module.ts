import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OtpService } from './otp.service';
import { SmsModule } from '../sms/sms.module';

@Module({
  imports: [
    SmsModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: Number(process.env.JWT_EXPIRES_IN_SECONDS ?? 900),
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, OtpService],
})
export class AuthModule {}
