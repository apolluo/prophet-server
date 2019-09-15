import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './task/task.module';
import { DbModule } from './db/db.module';
//import { Db } from './db/db.providers';

@Module({
  imports: [TaskModule, DbModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
