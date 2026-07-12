import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { OtpService } from './otp.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { RegisterEmailDto } from './dto/register-email.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { AttachEmailDto } from './dto/attach-email.dto';
import { VerifyEmailQueryDto } from './dto/verify-email-query.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

const REFRESH_COOKIE = 'refresh_token';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly otpService: OtpService,
  ) {}

  // ---------- Phone OTP (primary) ----------

  @Post('otp/request')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Send a 6-digit OTP to a phone (primary auth flow)',
    description:
      'OTP expires in 5 minutes, single-use. Without MSG91 credentials the response includes devOtp for testing. Limit: 3 requests per phone per 15 minutes.',
  })
  @ApiOkResponse({
    schema: {
      example: { message: 'OTP sent', expiresInSeconds: 300, devOtp: '123456' },
    },
  })
  @ApiTooManyRequestsResponse({
    description: 'More than 3 requests in 15 minutes for this phone',
  })
  requestOtp(@Body() dto: RequestOtpDto) {
    return this.otpService.request(dto.phone);
  }

  @Post('otp/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify OTP — logs in, auto-registers unknown phones',
  })
  @ApiOkResponse({
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIs…',
        refreshToken: '1961487d8735bfc1718…',
        isNewUser: true,
        user: {
          id: '8f8ca54f-ed93-46b9-837d-8c158588303a',
          phone: '+919876543210',
          role: 'CUSTOMER',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid, expired, or already-used OTP; or attempt limit hit',
  })
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  // ---------- Email + password (secondary) ----------

  @Post('register/email')
  @ApiOperation({
    summary: 'Register with email + password',
    description:
      'Creates an unverified account and emails a verification link (24h expiry). Does NOT log the user in. Without RESEND_API_KEY the response includes devVerificationUrl for testing.',
  })
  @ApiCreatedResponse({
    schema: { example: { message: 'Verification email sent.' } },
  })
  @ApiConflictResponse({ description: 'Email already registered' })
  registerEmail(@Body() dto: RegisterEmailDto) {
    return this.authService.registerEmail(dto);
  }

  @Get('verify-email')
  @ApiOperation({
    summary: 'Verify email from the link — redirects, auto-login for email-first users',
    description:
      'Single-use token. Email-first users get a refresh_token HttpOnly cookie (auto-login). Phone users who attached an email keep their existing session — no new tokens.',
  })
  @ApiResponse({ status: 302, description: 'Redirect to FRONTEND_URL/auth/verified' })
  @ApiUnauthorizedResponse({ description: 'Link invalid, expired, or already used' })
  async verifyEmail(
    @Query() query: VerifyEmailQueryDto,
    @Res() res: Response,
  ) {
    const result = await this.authService.verifyEmail(query.token);

    if (result.autoLogin) {
      const days = Number(process.env.REFRESH_EXPIRES_IN_DAYS ?? 7);
      res.cookie(REFRESH_COOKIE, result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: days * 24 * 60 * 60 * 1000,
        path: '/auth',
      });
    }

    const frontend = process.env.FRONTEND_URL ?? 'http://localhost:3100';
    return res.redirect(HttpStatus.FOUND, `${frontend}/auth/verified`);
  }

  @Post('login/email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email + password (verified email required)' })
  @ApiOkResponse({
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIs…',
        refreshToken: '1961487d8735bfc1718…',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Invalid email or password' })
  @ApiConflictResponse({ description: 'Please verify your email.' })
  loginEmail(@Body() dto: LoginDto) {
    return this.authService.loginEmail(dto);
  }

  @Post('email/resend')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend the verification email' })
  @ApiOkResponse({
    schema: { example: { message: 'Verification email sent.' } },
  })
  @ApiNotFoundResponse({ description: 'No account with this email' })
  @ApiConflictResponse({ description: 'Email is already verified' })
  @ApiTooManyRequestsResponse({ description: 'Wait 60 seconds between resends' })
  resendVerification(@Body() dto: ResendVerificationDto) {
    return this.authService.resendVerification(dto.email);
  }

  @Patch('me/email')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Attach an email to the logged-in (phone) account',
    description:
      'Sets email + password (password only if none exists) and sends a verification link. The current session stays valid — no new tokens are issued.',
  })
  @ApiOkResponse({
    schema: { example: { message: 'Verification email sent.' } },
  })
  @ApiConflictResponse({
    description: 'Account already has an email, or email is taken',
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  attachEmail(@Req() req: Request, @Body() dto: AttachEmailDto) {
    const user = req['user'] as { sub: string };
    return this.authService.attachEmail(user.sub, dto);
  }

  // ---------- Tokens ----------

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Exchange refresh token for a new access token',
    description: 'Reads the token from the body, or from the refresh_token HttpOnly cookie when the body is empty.',
  })
  @ApiOkResponse({
    schema: { example: { accessToken: 'eyJhbGciOiJIUzI1NiIs…' } },
  })
  @ApiUnauthorizedResponse({ description: 'Refresh token missing, invalid, or expired' })
  refresh(@Body() dto: RefreshDto, @Req() req: Request) {
    const token = dto.refreshToken ?? req.cookies?.[REFRESH_COOKIE];
    if (!token) {
      throw new UnauthorizedException('Missing refresh token');
    }
    return this.authService.refresh(token);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Revoke the refresh token',
    description: 'Accepts the token from the body or the refresh_token cookie; clears the cookie.',
  })
  @ApiOkResponse({
    schema: { example: { message: 'Logged out successfully' } },
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  async logout(
    @Body() dto: RefreshDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = dto.refreshToken ?? req.cookies?.[REFRESH_COOKIE];
    if (!token) {
      throw new UnauthorizedException('Missing refresh token');
    }
    res.clearCookie(REFRESH_COOKIE, { path: '/auth' });
    return this.authService.logout(token);
  }
}
