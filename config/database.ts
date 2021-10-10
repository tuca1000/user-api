import Env from '@secjs/env'

const createUri = (name: string): string => {
  if (name === 'default') name = ''

  const options = Env(`${name}DB_OPTIONS`, '')
  const user = Env(`${name}DB_USERNAME`, 'root')
  const pass = Env(`${name}DB_PASSWORD`, 'root')
  const db = Env(`${name}DB_DATABASE`, 'mongodb')
  const con = Env(`${name}DB_CONNECTION`, 'mongodb+srv')
  const host = Env(`${name}DB_HOST`, 'cluster0.uagp0.mongodb.net')

  return `${con}://${user}:${pass}@${host}/${db}?${options}`
}

export interface IDatabaseConfig {
  default: {
    url: string
    options: {
      useCreateIndex: boolean
      useNewUrlParser: boolean
      useFindAndModify: boolean
      useUnifiedTopology: boolean
      connectionName: string
    }
    schemas: any[]
  }
  redis: {
    host: string
    port: number
    password: string
  }
}

export default {
  /*
  |--------------------------------------------------------------------------
  | MongoDb
  |--------------------------------------------------------------------------
  |
  | Here we define connection settings for Mongo database.
  |
  | npm i --save mongoose
  |
  */
  default: {
    url: createUri('default'),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      connectionName: 'default',
    },
    schemas: [],
  },

  /*
  |--------------------------------------------------------------------------
  | Redis
  |--------------------------------------------------------------------------
  |
  | Here we define connection settings for Redis database.
  |
  | npm i --save redis
  |
  */
  redis: {
    host: Env('REDIS_HOST', 'localhost'),
    port: Env({ name: 'REDIS_PORT', type: 'number' }, 6379),
    password: Env('REDIS_PASSWORD', ''),
  },

  /*
  |--------------------------------------------------------------------------
  | Tables
  |--------------------------------------------------------------------------
  |
  | Here we define all the tables with her respective repository. Common used
  | by validators to get the exactly dependency by tables name.
  |
  */
  tables: {},
} as IDatabaseConfig
