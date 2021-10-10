import * as glob from 'glob'
import * as path from 'path'

import { IAppConfig } from 'config/app'
import { Debugger } from '@secjs/logger'
import { IHttpConfig } from 'config/http'
import { IViewConfig } from 'config/view'
import { ICorsConfig } from 'config/cors'
import { ICacheConfig } from 'config/cache'
import { ISwaggerConfig } from 'config/swagger'
import { IDatabaseConfig } from 'config/database'
import { IRateLimitConfig } from 'config/rateLimit'
import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces'

interface IConfig {
  app: IAppConfig
  cache: ICacheConfig
  cors: ICorsConfig
  database: IDatabaseConfig
  http: IHttpConfig
  rateLimit: IRateLimitConfig
  swagger: ISwaggerConfig
  view: IViewConfig
}

export class ApplicationProvider {
  private debug = new Debugger('api:provider')

  static utils: any[] = []
  static pipes: any[] = []
  static seeds: any[] = []
  static models: any[] = []
  static schemas: any[] = []
  static configs: any = {}
  static services: any[] = []
  static factories: any[] = []
  static validators: any[] = []
  static httpGuards: any[] = []
  static repositories: any[] = []
  static httpMiddlewares: any[] = []
  static httpControllers: any[] = []

  get utils() {
    return ApplicationProvider.utils
  }

  get models() {
    return ApplicationProvider.models
  }

  get schemas() {
    return ApplicationProvider.schemas
  }

  get seeds() {
    return ApplicationProvider.seeds
  }

  get factories() {
    return ApplicationProvider.factories
  }

  get validators() {
    return ApplicationProvider.validators
  }

  get repositories() {
    return ApplicationProvider.repositories
  }

  get configModule(): ConfigModuleOptions {
    return {
      isGlobal: true,
      ignoreEnvFile: true,
      load: [() => ApplicationProvider.configs],
    }
  }

  get configs(): IConfig {
    return ApplicationProvider.configs
  }

  get controllers() {
    return ApplicationProvider.httpControllers
  }

  get middlewares() {
    return ApplicationProvider.httpMiddlewares
  }

  get providers() {
    let providers = [
      ...ApplicationProvider.seeds,
      ...ApplicationProvider.pipes,
      ...ApplicationProvider.utils,
      ...ApplicationProvider.services,
      ...ApplicationProvider.factories,
      ...ApplicationProvider.validators,
      ...ApplicationProvider.httpGuards,
      ...ApplicationProvider.repositories,
    ]

    providers = providers.filter(provider => {
      if (!provider.prototype.onlyFromImports) return provider

      return false
    })

    return providers
  }

  clearMemory() {
    delete ApplicationProvider.configs

    delete ApplicationProvider.seeds
    delete ApplicationProvider.pipes
    delete ApplicationProvider.utils
    delete ApplicationProvider.models
    delete ApplicationProvider.schemas
    delete ApplicationProvider.services
    delete ApplicationProvider.factories
    delete ApplicationProvider.validators
    delete ApplicationProvider.httpGuards
    delete ApplicationProvider.repositories
    delete ApplicationProvider.httpMiddlewares
    delete ApplicationProvider.httpControllers

    this.debug.debug('🧹 Memory successfully cleared')
  }

  constructor() {
    this.bootSeeds()
    this.bootPipes()
    this.bootUtils()
    this.bootModels()
    this.bootSchemas()
    this.bootServices()
    this.bootFactories()
    this.bootValidators()
    this.bootHttpGuards()
    this.bootRepositories()
    this.bootHttpMiddlewares()
    this.bootHttpControllers()
    this.bootConfigs()
  }

  bootSeeds() {
    const debug = this.debug

    const fileExt = '.ts'
    const filePath = 'database/seeds'

    glob.sync(`${filePath}/**/*${fileExt}`).forEach(function (file) {
      const fileName = path.parse(file).name
      const replacedPath = file.replace(`${fileName}${fileExt}`, fileName)

      const Class = require(`../${replacedPath}`)[fileName]

      if (Class.prototype.ignore) {
        debug.warn(`🌱 Ignoring ${fileName}`)

        return
      }

      debug.debug(`🌱 Boot ${fileName}`)
      ApplicationProvider.seeds.push(Class)
    })
  }

  bootPipes() {
    const debug = this.debug

    const fileExt = '.ts'
    const filePath = 'app/Pipes'

    glob.sync(`${filePath}/**/*${fileExt}`).forEach(function (file) {
      const fileName = path.parse(file).name
      const replacedPath = file.replace(`${fileName}${fileExt}`, fileName)

      const Class = require(`../${replacedPath}`)[fileName]

      if (Class.prototype.ignore) {
        debug.warn(`🔩 Ignoring ${fileName}`)

        return
      }

      debug.debug(`🔩 Boot ${fileName}`)
      ApplicationProvider.pipes.push(Class)
    })
  }

  bootUtils() {
    const debug = this.debug

    const fileExt = '.ts'
    const filePath = 'app/Utils'

    glob.sync(`${filePath}/**/*${fileExt}`).forEach(function (file) {
      const fileName = path.parse(file).name
      const replacedPath = file.replace(`${fileName}${fileExt}`, fileName)

      const Class = require(`../${replacedPath}`)[fileName]

      if (Class.prototype.ignore) {
        debug.warn(`⛑️ Ignoring ${fileName}`)

        return
      }

      debug.debug(`⛑️ Boot ${fileName}`)
      ApplicationProvider.pipes.push(Class)
    })
  }

  bootModels() {
    const debug = this.debug
    const fileExt = '.ts'
    const filePath = 'app/Models'

    glob.sync(`${filePath}/**/*${fileExt}`).forEach(function (file) {
      const fileName = path.parse(file).name
      const replacedPath = file.replace(`${fileName}${fileExt}`, fileName)

      const Class = require(`../${replacedPath}`)[fileName]

      if (Class.prototype.ignore) {
        debug.warn(`🎲 Ignoring ${fileName}`)

        return
      }

      debug.debug(`🎲 Boot ${fileName}`)
      ApplicationProvider.models.push(Class)
    })
  }

  bootSchemas() {
    const debug = this.debug
    const fileExt = '.ts'
    const filePath = 'app/Schemas'

    glob.sync(`${filePath}/**/*${fileExt}`).forEach(function (file) {
      const fileName = path.parse(file).name
      const replacedPath = file.replace(`${fileName}${fileExt}`, fileName)

      const Model = require(`../${replacedPath}`)[fileName]
      const Schema = require(`../${replacedPath}`)[`${fileName}Schema`]

      if (Model.prototype.ignore) {
        debug.warn(`🎲 Ignoring ${fileName}`)

        return
      }

      debug.debug(`🎲 Boot ${fileName}`)
      ApplicationProvider.schemas.push({ name: Model.name, schema: Schema })
    })
  }

  bootConfigs() {
    const debug = this.debug
    const fileExt = '.ts'
    const filePath = 'config'

    glob.sync(`${filePath}/**/*${fileExt}`).forEach(function (file) {
      const fileName = path.parse(file).name
      const replacedPath = file.replace(`${fileName}${fileExt}`, fileName)

      debug.debug(`🔗 Boot ${fileName}`)
      ApplicationProvider.configs[fileName] =
        require(`../${replacedPath}`).default
    })
  }

  bootServices() {
    const debug = this.debug
    const fileExt = '.ts'
    const filePath = 'app/Services'

    glob.sync(`${filePath}/**/*${fileExt}`).forEach(function (file) {
      const fileName = path.parse(file).name
      const replacedPath = file.replace(`${fileName}${fileExt}`, fileName)

      const Class = require(`../${replacedPath}`)[fileName]

      if (Class.prototype.ignore) {
        debug.warn(`🔧 Ignoring ${fileName}`)

        return
      }

      debug.debug(`🔧 Boot ${fileName}`)
      ApplicationProvider.services.push(Class)
    })
  }

  bootFactories() {
    const debug = this.debug
    const fileExt = '.ts'
    const filePath = 'database/factories'

    glob.sync(`${filePath}/**/*${fileExt}`).forEach(function (file) {
      const fileName = path.parse(file).name
      const replacedPath = file.replace(`${fileName}${fileExt}`, fileName)

      const Class = require(`../${replacedPath}`)[fileName]

      if (Class.prototype.ignore) {
        debug.warn(`🏭 Ignoring ${fileName}`)

        return
      }

      debug.debug(`🏭 Boot ${fileName}`)
      ApplicationProvider.factories.push(Class)
    })
  }

  bootValidators() {
    const debug = this.debug
    const fileExt = '.ts'
    const filePath = 'app/Validators'

    glob.sync(`${filePath}/**/*${fileExt}`).forEach(function (file) {
      const fileName = path.parse(file).name
      const replacedPath = file.replace(`${fileName}${fileExt}`, fileName)

      const Class = require(`../${replacedPath}`)[fileName]

      if (Class.prototype.ignore) {
        debug.warn(`✅ Ignoring ${fileName}`)

        return
      }

      debug.debug(`✅ Boot ${fileName}`)
      ApplicationProvider.factories.push(Class)
    })
  }

  bootHttpGuards() {
    const debug = this.debug
    const fileExt = '.ts'
    const filePath = 'app/Http/Guards'

    glob.sync(`${filePath}/**/*${fileExt}`).forEach(function (file) {
      const fileName = path.parse(file).name
      const replacedPath = file.replace(`${fileName}${fileExt}`, fileName)

      const Class = require(`../${replacedPath}`)[fileName]

      if (Class.prototype.ignore) {
        debug.warn(`🛡️  Ignoring ${fileName}`)

        return
      }

      debug.debug(`🛡️  Boot ${fileName}`)
      ApplicationProvider.httpGuards.push(Class)
    })
  }

  bootRepositories() {
    const debug = this.debug
    const fileExt = '.ts'
    const filePath = 'app/Repositories'

    glob.sync(`${filePath}/**/*${fileExt}`).forEach(function (file) {
      const fileName = path.parse(file).name
      const replacedPath = file.replace(`${fileName}${fileExt}`, fileName)

      const Class = require(`../${replacedPath}`)[fileName]

      if (Class.prototype.ignore) {
        debug.warn(`🧱 Ignoring ${fileName}`)

        return
      }

      debug.debug(`🧱 Boot ${fileName}`)
      ApplicationProvider.repositories.push(Class)
    })
  }

  bootHttpMiddlewares() {
    const debug = this.debug
    const fileExt = '.ts'
    const filePath = 'app/Http/Middlewares'

    glob.sync(`${filePath}/**/*${fileExt}`).forEach(function (file) {
      const fileName = path.parse(file).name
      const replacedPath = file.replace(`${fileName}${fileExt}`, fileName)

      const Class = require(`../${replacedPath}`)[fileName]

      if (Class.prototype.ignore) {
        debug.warn(`📎 Ignoring ${fileName}`)

        return
      }

      debug.debug(`📎 Boot ${fileName}`)
      ApplicationProvider.httpMiddlewares.push({
        middleware: Class,
        routes: Class.routes,
      })
    })
  }

  bootHttpControllers() {
    const debug = this.debug
    const fileExt = '.ts'
    const filePath = 'app/Http/Controllers'

    glob.sync(`${filePath}/**/*${fileExt}`).forEach(function (file) {
      const fileName = path.parse(file).name
      const replacedPath = file.replace(`${fileName}${fileExt}`, fileName)

      const Class = require(`../${replacedPath}`)[fileName]

      if (Class.prototype.ignore) {
        debug.warn(`🚪 Ignoring ${fileName}`)

        return
      }

      debug.debug(`🚪 Boot ${fileName}`)
      ApplicationProvider.httpControllers.push(Class)
    })
  }
}

export default new ApplicationProvider()
