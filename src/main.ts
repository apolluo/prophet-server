import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import * as  compression  from 'compression'
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { TaskModule } from './task/task.module';
import { StoreModule } from './store/store.module';
import { from } from 'rxjs';
declare const module: any;

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
  app.use(compression())
  //await app.startAllMicroservicesAsync();
  const options = new DocumentBuilder()
    .setTitle('Prophet API')
    .setDescription('The prophet API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  const taskOptions = new DocumentBuilder()
    .setTitle('task example')
    .setDescription('The task API description')
    .setVersion('1.0')
    .addTag('task')
    .build();
  const taskDocument = SwaggerModule.createDocument(app, taskOptions, { include: [TaskModule] });
  SwaggerModule.setup('api/task', app, taskDocument);

  const storeOptions = new DocumentBuilder()
    .setTitle('store example')
    .setDescription('The store API description')
    .setVersion('1.0')
    .addTag('store')
    .build();
  const storeDocument = SwaggerModule.createDocument(app, storeOptions, { include: [StoreModule] });
  SwaggerModule.setup('api/store', app, storeDocument);
  
  await app.listen(8081);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
