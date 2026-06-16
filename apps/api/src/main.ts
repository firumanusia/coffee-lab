import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import cookieParser from 'cookie-parser'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(cookieParser())
  app.setGlobalPrefix('v1')
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

  const origins = (process.env.CORS_ORIGINS ?? 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean)
  app.enableCors({ origin: origins, credentials: true })

  const config = new DocumentBuilder()
    .setTitle('MENOOWEL API')
    .setDescription('Backend API for the MENOOWEL brewing studio (web + mobile).')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, config))

  const port = Number(process.env.PORT ?? 3000)
  await app.listen(port, '0.0.0.0')
  // eslint-disable-next-line no-console
  console.log(`MENOOWEL API on :${port}  (docs at /docs, routes under /v1)`)
}
bootstrap()
