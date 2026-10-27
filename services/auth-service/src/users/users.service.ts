import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>, // recibe el repositorio
  ) {}

  findByEmail(email: string): Promise<User | null> {
    return this.users.findOneBy({ email }); // SELECT * FROM users WHERE email = $1 LIMIT 1
  }

  create(data: {
    email: string;
    name: string;
    passwordHash: string;
  }): Promise<User> {
    const user = this.users.create(data); // arma el objeto en memoria
    return this.users.save(user); // INSERT INTO users ...
  }
}
