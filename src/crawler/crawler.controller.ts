import { Controller, Get, Query } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { ApiImplicitQuery, ApiUseTags } from '@nestjs/swagger';
import { url } from 'inspector';

@ApiUseTags('crawl')
@Controller('crawl')
export class CrawlerController {
    constructor(private readonly crawlerService: CrawlerService) {

    }
    @Get('/source')
    @ApiImplicitQuery({ name: 'sid', type: String })
    @ApiImplicitQuery({ name: 'key', type: String })
    @ApiImplicitQuery({ name: 'search', type: String })
    crawlSource(@Query('sid') sid, @Query('key') key, @Query('search') search) {
        return this.crawlerService.crawl({
            source: sid,
            searchParams: {
                [key]: search
            }
        })
    }
    @Get()
    @ApiImplicitQuery({ name: 'url', type: String })
    @ApiImplicitQuery({ name: 'rec', type: String })
    crawlAndRecognize(@Query('url') url, @Query('rec') rec) {
        return this.crawlerService.crawlAndRecognize(url, rec)
    }

    // @Get()
    // crawl( @Query('url') url){
    //     return this.crawlerService.crawlUrl(url)
    // }

}
