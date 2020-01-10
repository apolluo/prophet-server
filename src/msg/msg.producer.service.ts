import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib'
import { Message } from 'amqplib'
import { AMQP_URI } from '@/config';
import { Logger } from '@nestjs/common'

export class MsgProducerService {
    private readonly logger = new Logger(MsgProducerService.name)
   
    constructor(private readonly queue: string, private readonly prefetchCount?: number) { }
    private async init() {
        this.conn = await amqp.connect(AMQP_URI)
        this.channel = await this.conn.createChannel()
        this.conn.on('error', error => {
            this.logger.error(`[AMQP] connect error:${error.message}`)
            // this.reconnect()
        })
        this.conn.on('close', () => {
            this.logger.error(`[AMQP] consumer connect close with exception`)
        })
        if (this.prefetchCount) {
            await this.channel.prefetch(this.prefetchCount)
        }
        await this.channel.assertQueue(this.queue, { durable: true })
        this.logger.log(`[AMQP] consumer connect with ${this.queue}`)
    }
    private async reconnect() {

    }
}
