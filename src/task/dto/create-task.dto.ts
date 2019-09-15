import { ApiModelProperty } from '@nestjs/swagger';
export class CreateTaskDto {
    @ApiModelProperty()
    readonly name: string;
    @ApiModelProperty()
    readonly age: number;
    @ApiModelProperty()
    readonly breed: string;
}
