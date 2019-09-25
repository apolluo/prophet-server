import { ApiModelProperty } from '@nestjs/swagger';
export class CreateSourceDto {
    
    //源类型 1：web；2:search engine; 3 file;
    @ApiModelProperty()
    readonly type: Number
    //源状态 0：无法访问；1：正常；-1：解析错误；
    @ApiModelProperty()
    readonly status: Number
    @ApiModelProperty()
    readonly domain: String
    //源地址 
    @ApiModelProperty()
    readonly src: String
    //API `http://www.baidu.com/s?ie=utf-8&wd=${key}`
    @ApiModelProperty()
    readonly searchApi: String
    @ApiModelProperty()
    readonly searchParams: {
        key: String,
        value: String
    }
    //解析规则
    @ApiModelProperty()
    readonly parse: [String]
    //爬详细 0:不爬；1爬并按TAG保存 
    @ApiModelProperty()
    readonly crawlMore:Number
    
}
