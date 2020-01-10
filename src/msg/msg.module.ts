import { Module } from '@nestjs/common';
import { MsgService } from './msg.consumer';
import {MsgProducer} from './msg.producer'
import { MsgController } from './msg.controller';

@Module({
  providers: [MsgService,MsgProducer],
  exports:[MsgService,MsgProducer],
  controllers: [MsgController]
})
export class MsgModule {}
