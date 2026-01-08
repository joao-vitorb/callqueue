import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { BigIntSerializationInterceptor } from "./shared/interceptors/bigint.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = Number(process.env.PORT ?? 3000);

  app.useGlobalInterceptors(new BigIntSerializationInterceptor());

  app.enableCors({
    origin: ["http://localhost:5173", "https://callqueue-frontend.onrender.com"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  });

  await app.listen(port, "0.0.0.0");
}
bootstrap();
