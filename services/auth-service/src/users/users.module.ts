import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // crea el token "UserRepository"
  providers: [UsersService], // crea el token UsersService
  controllers: [UsersController],
  exports: [UsersService], // solo puede recibirse dentro de UsersModule
})
export class UsersModule {}
