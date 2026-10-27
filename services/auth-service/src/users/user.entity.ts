import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users') // la tabla se llamará "users"
export class User {
  @PrimaryGeneratedColumn('uuid') // PostgreSQL genera el UUID
  id: string;

  @Column({ unique: true }) // dos usuarios no pueden tener el mismo correo
  email: string;

  @Column()
  name: string;

  @Column()
  passwordHash: string;

  @CreateDateColumn()
  createdAt: Date;
}
