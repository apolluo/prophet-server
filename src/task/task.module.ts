import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TaskProviders } from './task.providers';
import { DbModule } from '../db/db.module';

@Module({
  imports: [DbModule],
  providers: [TaskService, ...TaskProviders],
  controllers: [TaskController]
})
export class TaskModule { }
