import { Controller, Get, Put, Body, Post, Param, Delete, Query } from '@nestjs/common';
import { ApiUseTags, ApiImplicitParam, ApiOperation, ApiImplicitQuery } from '@nestjs/swagger';
import { RuleService } from './rule.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { identifier } from '@babel/types';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { isDeepStrictEqual } from 'util';

@ApiUseTags('rule')
@Controller('rule')
export class RuleController {
    constructor(private readonly ruleService: RuleService) {

    }
    @Post()
    addRule(@Body() dto: CreateRuleDto) {
        return this.ruleService.create(dto)
    }

    @ApiOperation({ title: "根据ids查找填充好的规则" })
    @ApiImplicitQuery({
        name: "ids",
        description: 'rule id',
        required: true,
        isArray: true,
        collectionFormat: 'multi'
    })
    @Get('/query')
    findByIds(@Query('ids') ids) {
        return this.ruleService.findByIds(ids)
    }

    @Get()
    findAll() {
        return this.ruleService.findAll()
    }

    @ApiOperation({ title: "根据id修改规则" })
    @ApiImplicitParam({ name: "id", type: String, description: 'rule id' })
    @Put(':id')
    update(@Param('id') id, @Body() dto: UpdateRuleDto) {
        return this.ruleService.update(id, dto)
    }

    @ApiOperation({ title: "根据id删除规则" })
    @ApiImplicitParam({ name: "id" })
    @Delete(':id')
    remove(@Param('id') id) {
        return this.ruleService.remove(id)
    }
}
