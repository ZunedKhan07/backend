import {
  Controller,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @Throttle(5, 60)
  signup(@Body() body: any) {
    return this.authService.signup(body.username, body.password);
  }

  @Post('login')
  @Throttle(5, 60)
  login(@Body() body: any) {
    return this.authService.loginUser(body.username, body.password);
  }
}
