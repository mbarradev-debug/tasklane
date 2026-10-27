import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {} // recibe UsersService (capa 2)

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email); // ¿ya existe ese correo?
    if (existing) {
      throw new ConflictException('Email already registered'); // regla: correo repetido → 409
    }

    const passwordHash = await bcrypt.hash(dto.password, 10); // regla: guardar solo el hash

    const user = await this.usersService.create({
      // pide a UsersService el INSERT
      email: dto.email,
      name: dto.name,
      passwordHash,
    });

    return { id: user.id, email: user.email, name: user.name }; // nunca devolver passwordHash
  }
}
