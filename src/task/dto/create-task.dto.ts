import { ApiModelProperty } from '@nestjs/swagger';
export class CreateTaskDto {
    //任务类型 1：抓包；2
    @ApiModelProperty()
    //任务类型 {name:'type',enum:['系统任务','用户任务','管理员任务']}
    readonly type: Number

    //任务次数
    @ApiModelProperty()
    readonly count: Number

    //任务间隔 单位S
    @ApiModelProperty()
    readonly interval: Number

    //任务周期 M-W-D 情人节2--14 每月1号10点 ---1-10 每周一10点 
    @ApiModelProperty()
    readonly cycle: String

    //爬取方式 1：通过链接爬；2：通过源爬；3：通过Store；4：先Store，后源
    @ApiModelProperty()
    crawlType: Number

    // task name
    @ApiModelProperty()
    name: String

    //任务描述
    @ApiModelProperty()
    desc: String

    //链接
    @ApiModelProperty()
    link: String

    //源
    @ApiModelProperty()
    source: [String]

    //搜索方式 { name: 'searchType'  enum: ['Tag'  'Txt'  'Rule'] }
    @ApiModelProperty()
    searchType: Number

    //根据tag搜索
    @ApiModelProperty()
    searchTag: [String]

    //根据文字搜索
    @ApiModelProperty()
    searchTxt: [String]

    //根据规则搜索  web规则、搜索引擎规则、源规则
    @ApiModelProperty()
    searchRule: [String]

    //根据请求参数搜索
    @ApiModelProperty()
    searchParams: Object

    //根据关键词搜索
    @ApiModelProperty()
    searchWd: String

    //任务状态 0：未执行；1：执行成功；-1：执行错误；
    @ApiModelProperty()
    status: Number
}

