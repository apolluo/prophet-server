import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { StoreSchema } from './schemas/store.sckema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'Store', schema: StoreSchema }
  ])],
  providers: [StoreService],
  controllers: [StoreController]
})
export class StoreModule {}
