import { Controller, Get, Put, Body } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { RuleService } from './rule.service';
import { CreateRuleDto } from './dto/create-rule.dto';

@ApiUseTags('rule')
@Controller('rule')
export class RuleController {
    constructor(private readonly ruleService: RuleService) {

    }
    @Put('/add')
    addRule(@Body() dto: CreateRuleDto) {
        return this.ruleService.create(dto)
    }

    @Get()
    findAll() {
        return this.ruleService.findAll()
    }
}
