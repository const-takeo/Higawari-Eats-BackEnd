import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // app.use(JwtMiddleware);
  // localhost 3000 -request-> localhost 4000 acces denyを解決
  app.enableCors();
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
