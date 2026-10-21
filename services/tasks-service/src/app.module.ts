import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './tasks/task.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.TASKS_DB_HOST,
      port: 5432,
      username: process.env.TASKS_DB_USER,
      password: process.env.TASKS_DB_PASSWORD,
      database: process.env.TASKS_DB_NAME,
      entities: [Task],
      synchronize: true,
    }),
    TasksModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
