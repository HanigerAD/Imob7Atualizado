import { HttpAdapterHost, NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/filter/all-exceptions.filter";
import { validationPipe } from "./common/validation/validation-pipe";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    allowedHeaders: "*",
    exposedHeaders: "*",
  });

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  app.useGlobalPipes(validationPipe());
  await app.listen(3000);
}

async function run() {
  try {
    console.log('INICIANDO APLICAÇÃO');
    await bootstrap();
  } catch (error) {
    console.log('!!!ERRO NÃO TRATADO QUE DERRUBOU A APLICAÇÃO!!!');
    console.log(error);
    console.log('Reiniciando aplicação...');
    return run();
  }
}

run();
