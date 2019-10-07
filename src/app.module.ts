import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './task/task.module';
import { DbModule } from './db/db.module';
//import { Db } from './db/db.providers';
import { StoreModule } from './store/store.module';
import { TagModule } from './tag/tag.module';
import { SourceModule } from './source/source.module';
import { MongooseModule } from "@nestjs/mongoose";
import { CrawlerModule } from './crawler/crawler.module';
import { RuleModule } from './rule/rule.module';
import { PoolModule } from './pool/pool.module';

@Module({
  imports: [
    TaskModule, DbModule, StoreModule, TagModule, SourceModule,
    MongooseModule.forRoot('mongodb://root:123456@localhost/nest?authSource=admin'),
    CrawlerModule,
    RuleModule,
    PoolModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
