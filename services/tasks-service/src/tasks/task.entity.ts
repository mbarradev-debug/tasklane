import { text } from 'stream/consumers';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text', default: '' })
  description: string;

  @Column({ default: false })
  completed: boolean;

  @Column('uuid') // decorador de TypeORM: columna de tipo uuid, obligatoria (NOT NULL por defecto)
  ownerId: string; // id del dueño en auth-db; sin llave foránea (es otra base)

  @Column('uuid', { nullable: true })
  assigneeId: string | null; // id del usuario asignado (de auth-service); null = sin asignar

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
