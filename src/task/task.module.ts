import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TaskProviders } from './task.providers';
import { DbModule } from '../db/db.module';
import { CrawlerModule } from '@/crawler/crawler.module';
import { RuleModule } from '@/rule/rule.module';

@Module({
  imports: [DbModule, CrawlerModule,RuleModule],
  providers: [TaskService, ...TaskProviders],
  controllers: [TaskController]
})
export class TaskModule { }
