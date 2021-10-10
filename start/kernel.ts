import App from 'providers/ApplicationProvider'

import { CacheModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

/*
|--------------------------------------------------------------------------
| Kernel
|--------------------------------------------------------------------------
|
| Kernel is the imports from AppModule, all of the external modules that
| needs to be inside of NestJS IoC, will be exported in this Array.
|
*/

export default [
  ConfigModule.forRoot(App.configModule),
  CacheModule.registerAsync(App.configs.cache.redis),
  MongooseModule.forRoot(App.configs.database.default.url),
  MongooseModule.forFeature(App.schemas),
]
