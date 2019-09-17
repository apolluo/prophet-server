import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { StoreProviders } from './store.providers';
import { DbModule } from '../db/db.module';

@Module({
  imports: [DbModule],
  providers: [StoreService,...StoreProviders],
  controllers: [StoreController]
})
export class StoreModule {}
