import { NestFactory, Reflector } from '@nestjs/core';
import { MainModule } from './main.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import generateSwaggerDocument from './utils/swagger';

(async () => {
  const app = await NestFactory.create<NestFastifyApplication>(
    MainModule,
    new FastifyAdapter(),
  );

  app
    .useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))
    .useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

  app.enableCors({ origin: true, credentials: true });

  SwaggerModule.setup('docs', app, generateSwaggerDocument(app), {
    swaggerOptions: { persistAuthorization: true },
  });

  await app.listen(process.env.APP_PORT || 3000, '0.0.0.0');
})();
