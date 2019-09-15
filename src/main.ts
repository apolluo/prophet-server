import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  // Create your regular nest application.
  const app = await NestFactory.create(AppModule);

  // Then combine it with a RabbitMQ microservice
  // const microservice = app.connectMicroservice({
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: [`amqp://localhost:5672`],
  //     queue: 'my_queue',
  //     queueOptions: { durable: false },
  //   },
  // });

  //await app.startAllMicroservicesAsync();
  const options = new DocumentBuilder()
    .setTitle('Task example')
    .setDescription('The task API description')
    .setVersion('1.0')
    .addTag('task')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  await app.listen(3001);
}
bootstrap();
