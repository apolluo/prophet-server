import { Controller, Get,Query } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { ApiImplicitQuery } from '@nestjs/swagger';

@Controller('crawl')
export class CrawlerController {
    constructor(private readonly crawlerService: CrawlerService){

    }
    @ApiImplicitQuery({name:'url', type:String})
    @Get()
    crawl( @Query('url') url){
        return this.crawlerService.crawlUrl(url)
    }

}
