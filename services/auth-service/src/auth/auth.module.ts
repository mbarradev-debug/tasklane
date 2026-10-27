import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, // la clave: viene del .env a través de Compose
      signOptions: { expiresIn: '1h' }, // cada pulsera vence en una hora
    }),
  ], // recibe lo que UsersModule exporta (ahora: nada)
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
