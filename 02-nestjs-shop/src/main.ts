import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'

import { AppModule } from './app.module'

export async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const port = process.env.PORT || 3000

  app.setGlobalPrefix('api')
  app.enableCors()
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  )

  // documentacion con swagger
  const config = new DocumentBuilder()
    .setTitle('Nest Shop API')
    .setDescription('Desarrollo de APIs con NestJS simulando un Ecommerce')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  await app.listen(port)
  console.log('Server run on port', port)
}
bootstrap()
