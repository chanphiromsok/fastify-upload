import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import  {contentParser} from "fastify-multer"
import {join} from "path"
import helmet from "fastify-helmet"
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'; 
const swaggerDocument = new DocumentBuilder()
.setTitle('API')
.setDescription('API')
.setVersion('1.0')
.addTag('API')
.build();
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule,new FastifyAdapter());
  await app.listen(3000);
  app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
    },
  });
  app.register(contentParser)
  app.useStaticAssets({root:join(__dirname,"../../fastify-file-upload")})
  
  SwaggerModule.setup("api",app,SwaggerModule.createDocument(app,swaggerDocument))
  console.log(`APP IS RUNNING ON PORT ${await app.getUrl()}`,join(__dirname,"../../fastify-file-upload"))
}
bootstrap();
