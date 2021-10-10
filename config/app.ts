import * as packageJson from '../package.json'

import Env from '@secjs/env'

import { RequestMethod } from '@nestjs/common'
import { IFullException } from 'app/Http/Filters/AllExceptionFilter'

export interface IErrorMappers {
  secJs: (exception: any) => IFullException
}
export interface IAppConfig {
  name: string
  description: string
  host: string
  port: number
  domain: string
  prefix: {
    name: string
    exclude: { path: string; method: RequestMethod }[]
  }
  appKey: string
  version: string
  locale: string
  environment: string
  authorization: {
    defaultStrategy: string
    jwt: {
      secret: string
      signOptions: { expiresIn: number }
    }
  }
  errorMappers: IErrorMappers
}

export default {
  /*
  |--------------------------------------------------------------------------
  | Application Name
  |--------------------------------------------------------------------------
  |
  | This value is the name of your application and can used when you
  | need to place the application's name in a email, view or
  | other location.
  |
  */

  name: Env('APP_NAME', 'NestJS'),

  /*
  |--------------------------------------------------------------------------
  | Application Description
  |--------------------------------------------------------------------------
  |
  | This value is the description of your application and can used when you
  | need to place the application's description in swagger, view or
  | other location.
  |
  */

  description: Env('APP_DESCRIPTION', 'NestJS Framework'),

  /*
  |--------------------------------------------------------------------------
  | Application host
  |--------------------------------------------------------------------------
  |
  | This value is the HOST of your application and its used to access your
  | application.
  |
  */

  host: Env('HOST', '127.0.0.1'),

  /*
  |--------------------------------------------------------------------------
  | Application port
  |--------------------------------------------------------------------------
  |
  | This value is the PORT of your application and its used to access your
  | application.
  |
  */

  port: Env({ name: 'PORT', type: 'number' }, 3000),

  /*
    |--------------------------------------------------------------------------
    | Application domain
    |--------------------------------------------------------------------------
    |
    | This value is the APP_DOMAIN of your application and its used to access your
    | application.
    |
    */

  domain: Env('APP_DOMAIN', 'http://localhost:3000'),

  /*
  |--------------------------------------------------------------------------
  | Application prefix
  |--------------------------------------------------------------------------
  |
  | This value is the prefix of your application and can used when you
  | need to place the application's prefix in a route, view or
  | other location.
  |
  */

  prefix: {
    name: Env('APP_PREFIX', '/srv'),
    exclude: [
      { path: '/', method: RequestMethod.GET },
      { path: '/git', method: RequestMethod.GET },
    ],
  },

  /*
  |--------------------------------------------------------------------------
  | Application key
  |--------------------------------------------------------------------------
  |
  | This value is the application key used to make hashs and to authorize,
  | requests.
  |
  */

  appKey: Env('APP_KEY', '12345'),

  /*
  |--------------------------------------------------------------------------
  | Application source url
  |--------------------------------------------------------------------------
  |
  | This value is the application source url, usually a link to a git repo-
  | sitory.
  |
  */
  source: Env('APP_SOURCE', 'https://github.com'),

  /*
  |--------------------------------------------------------------------------
  | Documentation url
  |--------------------------------------------------------------------------
  |
  | This value is the application documentation url, usually a link to the
  | main documentation of the API.
  |
  */
  documentation: Env('APP_DOMAIN', 'http://localhost:3000'),

  /*
  |--------------------------------------------------------------------------
  | Application Version
  |--------------------------------------------------------------------------
  |
  | This value is the version of your application and can used when you
  | need to place the application's version in a route, view or
  | other location.
  |
  */
  version: packageJson.version,

  /*
  |--------------------------------------------------------------------------
  | Default Locale
  |--------------------------------------------------------------------------
  |
  | Default locale to be used by Antl provider. You can always switch drivers
  | in runtime or use the official Antl middleware to detect the driver
  | based on HTTP headers/query string.
  |
  */
  locale: Env('APP_LOCALE', 'pt'),

  /*
  |--------------------------------------------------------------------------
  | Default environment
  |--------------------------------------------------------------------------
  |
  | Default environment of the application.
  |
  */
  environment: Env('NODE_ENV', 'development'),

  /*
  |--------------------------------------------------------------------------
  | Default authorization strategy
  |--------------------------------------------------------------------------
  |
  | Default authorization strategy for the entire application.
  |
  */
  authorization: {
    defaultStrategy: 'jwt',
    jwt: {
      secret: Env('APP_KEY', ''),
      signOptions: { expiresIn: 18000 },
    },
    apiKey: Env('APP_KEY', '12345'),
  },

  errorMappers: {
    secJs: (exception: any): IFullException => {
      return {
        isSecJsException: true,
        name: exception.name,
        stack: exception.stack,
        status: exception.status,
        message: {
          error: exception.name
            .replace('Exception', 'Error')
            .replace(/([A-Z])/g, ' $1')
            .trim(),
          message: exception.message,
          statusCode: exception.status,
        },
      }
    },
  },
} as IAppConfig
