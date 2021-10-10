import * as helmet from 'helmet'
import * as express from 'express'
import * as rateLimit from 'express-rate-limit'

import ApplicationProvider from 'providers/ApplicationProvider'

import { AppModule } from 'app/AppModule'
import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { SwaggerModule } from '@nestjs/swagger'
import { PrismaService } from 'app/Services/Utils/PrismaService'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AllExceptionFilter } from 'app/Http/Filters/AllExceptionFilter'
import { ResponseInterceptor } from 'app/Http/Interceptors/ResponseInterceptor'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const Config: ConfigService = app.get(ConfigService)

  const swagger = Config.get('swagger')
  const { name, exclude } = Config.get('app.prefix')

  app.use(helmet())
  app.use(rateLimit(Config.get('rateLimit')))

  app.setGlobalPrefix(name, { exclude })
  app.enableCors(Config.get('cors'))
  app.setBaseViewsDir(Config.get('view.paths.views'))
  app.useGlobalFilters(new AllExceptionFilter(Config))
  app.useGlobalInterceptors(new ResponseInterceptor(Config))
  app.setViewEngine('hbs')

  app.use('/assets', express.static(Config.get('view.paths.assets')))
  app.use('/images', express.static(Config.get('view.paths.images')))

  const prismaService: PrismaService = app.get(PrismaService)

  prismaService.enableShutdownHooks(app)

  SwaggerModule.setup(swagger.prefix, app, swagger.createDocument(app))

  await app.listen(Config.get('app.port'))
  ApplicationProvider.clearMemory()
}

bootstrap().catch()
