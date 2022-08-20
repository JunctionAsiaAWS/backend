import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

type SwaggerTag = { name: string; description: string };

export const tags: SwaggerTag[] = [
  { name: '사용자', description: '사용자 관련 작업' },
];

const document = new DocumentBuilder()
  .setTitle('Swagger API')
  .setDescription('Swagger API Document')
  .addBearerAuth({
    type: 'http',
    scheme: 'bearer',
    description: '사용자 인증을 위한 토큰입니다.',
  })
  .addServer(process.env.APP_URL || 'http://localhost:3000')
  .addServer('https://api.uoslife.team')
  .setVersion('22.08.0');

tags.forEach((tag) => document.addTag(tag.name, tag.description));

export default function generateSwaggerDocument(app: NestFastifyApplication) {
  return SwaggerModule.createDocument(app, document.build());
}
