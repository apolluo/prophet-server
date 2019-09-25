import { Module } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { CrawlerController } from './crawler.controller';
import { SourceModule } from '@/source/source.module';
import { TagModule } from '@/tag/tag.module';

@Module({
  imports:[SourceModule,TagModule],
  providers: [CrawlerService],
  controllers: [CrawlerController],
  exports: [CrawlerService]
})
export class CrawlerModule { }
