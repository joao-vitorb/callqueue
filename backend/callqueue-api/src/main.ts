import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BigIntSerializationInterceptor } from './shared/interceptors/bigint.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new BigIntSerializationInterceptor());

  app.enableCors({
    origin: 'http://localhost:5173',
  });

  await app.listen(3000);
}
bootstrap();
