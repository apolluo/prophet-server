import { Controller, Get,Query } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { ApiImplicitQuery, ApiUseTags } from '@nestjs/swagger';

@ApiUseTags('crawl')
@Controller('crawl')
export class CrawlerController {
    constructor(private readonly crawlerService: CrawlerService){

    }
    @Get('/source')
    @ApiImplicitQuery({name:'sid', type:String})
    @ApiImplicitQuery({name:'key', type:String})
    @ApiImplicitQuery({name:'search', type:String})
    crawlSource(@Query('sid') sid, @Query('key') key,  @Query('search') search){
        return this.crawlerService.crawl({
            source:sid,
            searchParams:{
                [key]:search
            }
        })
    }
    
    // @Get()
    // crawl( @Query('url') url){
    //     return this.crawlerService.crawlUrl(url)
    // }

}
