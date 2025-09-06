import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { 
  UserSchema, 
  CreateUserSchema, 
  UpdateUserSchema,
  LoginSchema,
  RegisterSchema,
  AuthResponseSchema,
  PaginationSchema,
  ApiResponseSchema
} from '@hic/shared-schemas';
import { generateSchema } from '@anatine/zod-openapi';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS configuration
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api/auth');

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('HIC Auth Service API')
    .setDescription('Authentication and User Management API for HIC project')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [
      generateSchema(UserSchema),
      generateSchema(CreateUserSchema),
      generateSchema(UpdateUserSchema),
      generateSchema(LoginSchema),
      generateSchema(RegisterSchema),
      generateSchema(AuthResponseSchema),
      generateSchema(PaginationSchema),
      generateSchema(ApiResponseSchema(UserSchema)),
    ] as any[],
  });

  SwaggerModule.setup('docs', app, document);

  const port = process.env.AUTH_PORT || 3012;
  await app.listen(port, '0.0.0.0');
  console.log(`Auth Service is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/docs`);
}

bootstrap();