import { Test } from '@nestjs/testing'
import { Debugger } from '@secjs/logger'
import { ConfigService } from '@nestjs/config'
import { INestApplication } from '@nestjs/common'
import { PrismaService } from 'app/Services/Utils/PrismaService'
import { RedisCacheService } from 'app/Services/Utils/RedisCacheService'
import { AllExceptionFilter } from 'app/Http/Filters/AllExceptionFilter'
import { ResponseInterceptor } from 'app/Http/Interceptors/ResponseInterceptor'

export class App {
  public server: INestApplication

  private imports: any[]
  private debug = new Debugger('api:test')

  constructor(imports: any[]) {
    this.imports = imports
  }

  getInstance<Instance = any>(instance: any) {
    this.debug.debug(`Calling ${instance.name} instance from Nest IoC`)

    return this.server.get<Instance>(instance) as Instance
  }

  async initApp() {
    const moduleRef = await Test.createTestingModule({
      imports: this.imports,
    }).compile()

    this.server = moduleRef.createNestApplication()

    const Config = this.getInstance(ConfigService)
    this.server.useGlobalFilters(new AllExceptionFilter(Config))
    this.server.useGlobalInterceptors(new ResponseInterceptor(Config))

    await this.server.init()

    this.debug.debug('Nest test module started')

    return this
  }

  async closeApp() {
    this.debug.warn('Nest test module closed')

    await this.server.close()
    await this.getInstance(PrismaService).$disconnect()
    await this.getInstance(RedisCacheService).close()
  }
}
