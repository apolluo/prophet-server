import { ApiModelProperty } from '@nestjs/swagger';
export class CreateStoreDto {
    //任务类型 1：抓包；2
    @ApiModelProperty()
    type: Number;
    
    @ApiModelProperty()
    name: String;

    @ApiModelProperty()
    title: String;

    @ApiModelProperty()
    author: String;

    @ApiModelProperty()
    des: String;

    @ApiModelProperty()
    children: [String]

    @ApiModelProperty()
    context: String;

    @ApiModelProperty()
    comefrom: String;

    @ApiModelProperty()
    comefromDomain:String;
    
    @ApiModelProperty()
    comefromUrl: String;

    @ApiModelProperty()
    tags: [String]
}
