import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { LoggingInterceptor } from '../infrastructure/interceptors/logging.interceptor';
import { HttpExceptionFilter } from '../infrastructure/exception-filters/http.exception.filter';
import { useContainer } from 'class-validator';
import { AppModule } from '../app.module';
import cookieParser from 'cookie-parser';

// Префикс нашего приложения (https://site.com/api)

//const APP_PREFIX = '/api';

// Используем данную функцию в main.ts и в e2e тестах
export const applyAppSettings = (app: INestApplication) => {
  // Применение глобальных Interceptors
  app.useGlobalInterceptors(new LoggingInterceptor());

  app.enableCors();

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const responseErrors: any[] = [];
        errors.forEach((e) => {
          if (e.constraints) {
            const constraintsKeys = Object.keys(e.constraints);
            constraintsKeys.forEach((cKey) => {
              responseErrors.push({
                message: e.constraints![cKey],
                field: e.property,
              });
            });
          }
        });
        throw new BadRequestException(responseErrors);
      },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  //define useContainer in main.ts file
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  //const userService = app.get(UsersService)

  // Применение глобальных Guards
  // app.useGlobalGuards(new AuthGuard(userService));

  // Применить middleware глобально
  //app.use(LoggerMiddlewareFunc);

  // Установка префикса
  //setAppPrefix(app);

  // Конфигурация swagger документации
  //setSwagger(app);

  // Применение глобальных pipes
  //setAppPipes(app);

  // Применение глобальных exceptions filters
  //setAppExceptionsFilters(app);
};

// const setAppPrefix = (app: INestApplication) => {
//   // Устанавливается для разворачивания front-end и back-end на одном домене
//   // https://site.com - front-end
//   // https://site.com/api - backend-end
//   app.setGlobalPrefix(APP_PREFIX);
// };

/*const setSwagger = (app: INestApplication) => {
  if (!appSettings.env.isProduction()) {
    const swaggerPath = APP_PREFIX + '/swagger-doc';

    const config = new DocumentBuilder()
      .setTitle('BLOGGER API')
      .addBearerAuth()
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(swaggerPath, app, document, {
      customSiteTitle: 'Blogger Swagger',
    });
  }
};*/

/*const setAppPipes = (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      // Для работы трансформации входящих данных
      transform: true,
      // Выдавать первую ошибку для каждого поля
      stopAtFirstError: true,
      // Перехватываем ошибку, кастомизируем её и выкидываем 400 с собранными данными
      exceptionFactory: (errors) => {
        const customErrors = [];
        console.log(errors);

        errors.forEach((e) => {
          const constraintKeys = Object.keys(e.constraints);

          constraintKeys.forEach((cKey) => {
            const msg = e.constraints[cKey];

            customErrors.push({ key: e.property, message: msg });
          });
        });

        // customErrors = [{key: "email", message: "Bad length"}, {key: "name", message: "Bad name"}]

        // Error 400
        throw new BadRequestException(customErrors);
      },
    }),
  );
};*/

// const setAppExceptionsFilters = (app: INestApplication) => {
//   app.useGlobalFilters(new HttpExceptionFilter());
// };
