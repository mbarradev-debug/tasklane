import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {} // recibe AuthService

  @Post('register') // POST /auth/register
  register(@Body() dto: RegisterDto) {
    // @Body: el JSON de la petición, validado contra RegisterDto
    return this.authService.register(dto); // delega a la capa 2
  }
}
