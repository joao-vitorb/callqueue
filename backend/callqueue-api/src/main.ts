import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { BigIntSerializationInterceptor } from "./shared/interceptors/bigint.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 4000;

  app.enableShutdownHooks();

  app.useGlobalInterceptors(new BigIntSerializationInterceptor());

  app.enableCors({
    origin: "https://callqueue-backend.onrender.com",
  });

  await app.listen(3000);
}
bootstrap();
