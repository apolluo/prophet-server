import { ApiModelProperty } from '@nestjs/swagger';
export class CreateSourceDto {
    //任务类型 1：抓包；2
    @ApiModelProperty()
    readonly type: Number;
    //任务状态 0：未执行；1：执行成功；-1：执行错误；
    @ApiModelProperty()
    readonly status: Number;
    //任务是否结束
    @ApiModelProperty()
    readonly context: String;
    @ApiModelProperty()
    readonly createTime: Date;
    @ApiModelProperty()
    readonly updateTime: Date;
}
