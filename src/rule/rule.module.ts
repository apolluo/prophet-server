import { Module } from '@nestjs/common';
import { RuleController } from './rule.controller';
import { RuleService } from './rule.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RuleSchema } from './schemas/rule.sckema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'Rule', schema: RuleSchema }
  ])],
  controllers: [RuleController],
  providers: [RuleService],
  exports:[RuleService]
})
export class RuleModule { }
