import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { cookieOptions } from './config/server.config';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(cookieOptions());

  const options = new DocumentBuilder()
    .setTitle('Dance School')
    .setDescription('Dance School application')
    .setVersion('1.0')
    .addTag('dance-school')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  app.use(cookieParser());
  await app.listen(process.env.PORT || 8000);
}

bootstrap();
