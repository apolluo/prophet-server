import { Controller, Get, Put, Body, Post, Param, Logger, Query } from '@nestjs/common';
import { SourceService } from './source.service';
import { ApiUseTags, ApiOperation, ApiImplicitParam } from '@nestjs/swagger';
import { CreateSourceDto } from './dto/create-source.dto';

@ApiUseTags('source')
@Controller('source')
export class SourceController {
    private readonly logger=new Logger(SourceController.name)
    constructor(private readonly sourceService: SourceService) { }
    
    @Get()
    @ApiOperation({ title: "根据id数组查找源" })
    @ApiImplicitParam({ name: "ids", type: [], description: 'source id array' })
    async getSourceByIds(@Query('ids') ids){
        this.logger.log(ids)
        const callback=source=>source
        return await this.sourceService.findByIds(ids,callback)
    }
    // @Get()
    // getSource() {
    //     this.logger.log('findAll')
    //     return this.sourceService.findAll()
    // }
    @Post()
    addSource(@Body() createSourceDto: CreateSourceDto) {
        return this.sourceService.create(createSourceDto)
    }
}
