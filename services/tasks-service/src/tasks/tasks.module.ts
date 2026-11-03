import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    JwtModule.register({ secret: process.env.JWT_SECRET }),
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
