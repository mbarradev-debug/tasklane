import {
  Body,
  Controller,
  Post,
  HttpCode,
  UnauthorizedException,
  Get,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {} // recibe AuthService

  @Post('register') // POST /auth/register
  register(@Body() dto: RegisterDto) {
    // @Body: el JSON de la petición, validado contra RegisterDto
    return this.authService.register(dto); // delega a la capa 2
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  me(@Headers('authorization') authorization?: string) {
    const [type, token] = authorization?.split(' ') ?? []; // "Bearer eyJ..." → ["Bearer", "eyJ..."]
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Missing token'); // sin header o con formato incorrecto
    }
    return this.authService.me(token);
  }
}
