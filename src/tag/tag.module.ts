import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { TagProviders } from './tag.providers';
import { DbModule } from '../db/db.module';

@Module({
  imports: [DbModule],
  providers: [TagService, ...TagProviders],
  controllers: [TagController],
  exports:[TagService]
})
export class TagModule { }
