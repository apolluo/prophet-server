import { Controller, Get, Put, Body, Post, Param, Logger, Query } from '@nestjs/common';
import { SourceService } from './source.service';
import { ApiUseTags, ApiOperation, ApiImplicitParam, ApiImplicitQuery } from '@nestjs/swagger';
import { CreateSourceDto } from './dto/create-source.dto';

@ApiUseTags('source')
@Controller('source')
export class SourceController {
    private readonly logger = new Logger(SourceController.name)
    constructor(private readonly sourceService: SourceService) { }

    @Get('/query')
    @ApiOperation({ title: "根据id数组查找源" })
    @ApiImplicitQuery({
        name: 'ids', description: 'source id array',
        required: true,
        isArray: true,
        //enum:['5d8493bf77a69f2239d03e46'],
        collectionFormat: 'multi'
    })
    //@ApiImplicitParams({ name: "ids", type: [], description: 'source id array' })
    async getSourceByIds(@Query('ids') ids) {
        this.logger.log(ids)
        let res;
        let resP
        const callback = source => {
            //return source
            res = {
                source,
                code: 200
            }
            // resP = new Promise((resolve, reject) => {
            //     if (res) {
            //         return resolve(res)
            //     } else {
            //         return reject()
            //     }
            // })
            // return  resP
            //resP.resolve(res)
        }

        await this.sourceService.findByIds(ids, callback)
        this.logger.log(JSON.stringify(res))
        return res
        // let resP = new Promise((resolve, reject) => {
        //     if (res) {
        //         resolve(res)
        //     } else {
        //         reject('error')
        //     }
        // })
        // return callback.then((res) => {
        //     return res
        // })
        //return callback;
    }
    @Get()
    getSource() {
        this.logger.log('findAll')
        return this.sourceService.findAll()
    }
    @Post()
    addSource(@Body() createSourceDto: CreateSourceDto) {
        return this.sourceService.create(createSourceDto)
    }
}
