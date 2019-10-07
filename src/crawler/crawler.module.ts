import { Module } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { CrawlerController } from './crawler.controller';
import { SourceModule } from '@/source/source.module';
import { TagModule } from '@/tag/tag.module';
import { PoolModule } from '@/pool/pool.module';

@Module({
  imports: [SourceModule, TagModule, PoolModule],
  providers: [CrawlerService],
  controllers: [CrawlerController],
  exports: [CrawlerService]
})
export class CrawlerModule { }
