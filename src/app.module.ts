import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './task/task.module';
import { DbModule } from './db/db.module';
//import { Db } from './db/db.providers';
import { StoreModule } from './store/store.module';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [TaskModule, DbModule, StoreModule, TagModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
