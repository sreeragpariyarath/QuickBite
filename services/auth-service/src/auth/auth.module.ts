import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailVerificationService } from './email-verification.service';
import { FirebaseAdminService } from './firebase-admin.service';
import { PasswordResetService } from './password-reset.service';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    EmailModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: Number(process.env.JWT_EXPIRES_IN_SECONDS ?? 900),
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    EmailVerificationService,
    FirebaseAdminService,
    PasswordResetService,
  ],
})
export class AuthModule {}
