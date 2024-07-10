import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { error } from 'console';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    //logger: ['error', 'warn', 'debug', 'log']
  });
  app.useGlobalPipes(new ValidationPipe()); // enable validation globally
  await app.listen(3001);
}
bootstrap();
