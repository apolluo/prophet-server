import { Controller, Get, Put, Post, Body } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { MsgProducer } from './msg.producer';

@Controller('msg')
@ApiUseTags('msg')
export class MsgController {
    constructor(private readonly producer:MsgProducer){
        
    }
    @Post()
    sendMsg(@Body() msg:any){
        this.producer.send(msg)
    }
}
