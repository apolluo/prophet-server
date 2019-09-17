import { Controller, Get, Put, Body } from '@nestjs/common';
import { SourceService } from './source.service';
import { ApiUseTags } from '@nestjs/swagger';
import { CreateSourceDto } from './dto/create-source.dto';

@ApiUseTags('source')
@Controller('source')
export class SourceController {
    constructor(private readonly sourceService: SourceService) { }
    @Get()
    getSource() {
        return this.sourceService.findAll()
    }
    @Put('/add')
    addSource(@Body() createSourceDto: CreateSourceDto) {
        return this.sourceService.create(createSourceDto)
    }
}
