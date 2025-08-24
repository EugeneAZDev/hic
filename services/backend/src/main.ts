
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Set global prefix for all routes
  app.setGlobalPrefix('api');

  // Enable CORS for frontend - allow any local IP on frontend port
  const frontendPort = process.env.FRONTEND_PORT || 5001;
  const domain = process.env.DOMAIN || 'localhost';
  
  app.enableCors({
    origin: [
      // Local development
      `http://localhost:${frontendPort}`,
      new RegExp(`^http://192\\.168\\.\\d+\\.\\d+:${frontendPort}$`), // Allow any local network IP
      new RegExp(`^http://10\\.\\d+\\.\\d+\\.\\d+:${frontendPort}$`),  // Allow 10.x.x.x networks
      new RegExp(`^http://172\\.(1[6-9]|2[0-9]|3[0-1])\\.\\d+\\.\\d+:${frontendPort}$`), // Allow 172.16-31.x.x networks
      
      // Production domain (HTTP and HTTPS)
      `http://${domain}`,
      `https://${domain}`,
      `http://www.${domain}`,
      `https://www.${domain}`,
    ],
    credentials: true,
  });

  const port = process.env.BACKEND_PORT || 7001;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Backend running on http://localhost:${port}`);
}

bootstrap();