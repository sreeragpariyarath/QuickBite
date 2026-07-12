import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { OtpService } from './otp.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly otpService: OtpService,
  ) {}

  @Post('otp/request')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Send a 6-digit OTP to a phone (primary auth flow)',
    description:
      'OTP expires in 5 minutes, single-use. Without MSG91 credentials the response includes devOtp for testing. Limit: 3 requests per phone per 15 minutes.',
  })
  @ApiOkResponse({
    description: 'OTP sent',
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
    description: 'Authenticated',
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

  @Post('register')
  @ApiOperation({ summary: 'Register with email + password (secondary flow)' })
  @ApiCreatedResponse({
    description: 'User created',
    schema: {
      example: {
        id: '329be544-a3ee-48dd-896d-3457b2cfb0dd',
        email: 'customer@example.com',
        role: 'CUSTOMER',
        createdAt: '2026-07-09T17:26:21.474Z',
      },
    },
  })
  @ApiConflictResponse({ description: 'Email already registered' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email + password (secondary flow)' })
  @ApiOkResponse({
    description: 'Authenticated',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIs…',
        refreshToken: '1961487d8735bfc1718…',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Invalid email or password' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Exchange refresh token for a new access token' })
  @ApiOkResponse({
    schema: { example: { accessToken: 'eyJhbGciOiJIUzI1NiIs…' } },
  })
  @ApiUnauthorizedResponse({ description: 'Refresh token invalid or expired' })
  refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revoke the refresh token' })
  @ApiOkResponse({
    schema: { example: { message: 'Logged out successfully' } },
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  logout(@Body() dto: RefreshDto) {
    return this.authService.logout(dto.refreshToken);
  }
}
