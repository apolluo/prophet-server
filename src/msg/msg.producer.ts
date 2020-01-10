import * as amqp from 'amqplib'
import { Logger } from '@nestjs/common'
import { AMQP_URI } from '@/config';

export class MsgProducer {
    private readonly logger = new Logger(MsgProducer.name)
    private conn: amqp.Connection = null;
    private channel: amqp.Channel = null;
    constructor(private readonly queue: string) {
        this.init()
    }
    async init() {
        this.conn = await amqp.connect(AMQP_URI)
        this.conn.on('error', async error => {
            this.logger.error(`[AMQP] Producer connect fail with error:${error.message}`)
        })
        this.conn.on('close', async error => {
            this.logger.error(`[AMQP] Producer connect fail with error:${error.message}`)
        })
        this.channel = await this.conn.createChannel()
        await this.channel.assertQueue(this.queue, { durable: true })
        this.logger.log(`[AMQP] Producer connect with ${this.queue}`)
    }
    async send(msg) {
        this.channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(msg)))
        this.logger.log(`[AMQP] Producer send msg to ${this.queue},${msg}`)
    }
    public close() {
        this.channel && this.channel.close();
        this.conn && this.conn.close();
    }
    private async reconnect() {

    }
}