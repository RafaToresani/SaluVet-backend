import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('port');
  const version = configService.get('version');
  app.setGlobalPrefix(`api/${version}`);
  
  await app.listen(port);
}
bootstrap();
