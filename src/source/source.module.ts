import { Module } from '@nestjs/common';
import { SourceService } from './source.service';
import { SourceController } from './source.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SourceSchema } from './schemas/source.sckema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Source', schema: SourceSchema }
    ])
  ],
  providers: [SourceService],
  controllers: [SourceController]
})
export class SourceModule { }
