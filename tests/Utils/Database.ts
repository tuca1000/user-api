import { App } from 'tests/Utils'
import { PrismaService } from 'app/Services/Utils/PrismaService'
import { RedisCacheService } from 'app/Services/Utils/RedisCacheService'

export class Database {
  private app: App
  private prisma: PrismaService

  constructor(app: App) {
    this.app = app
    this.prisma = this.getConnection()
  }

  getConnection() {
    return this.app.getInstance<PrismaService>(PrismaService)
  }

  getRepository<Repository>(repository: any) {
    return this.app.getInstance<Repository>(repository)
  }

  async closeConnection() {
    await this.prisma.$disconnect()
  }

  async truncate() {
    const promises = []

    const modelNames = Object.getOwnPropertyNames(this.prisma).filter(
      x => !x.startsWith('_'),
    )

    modelNames.forEach(modelName => {
      promises.push(this.prisma[modelName].deleteMany())
    })

    await Promise.all(promises)
  }

  async truncateCache() {
    const redisService = this.app.getInstance(RedisCacheService)

    await redisService.truncate()
  }
}

/* eslint-disable eqeqeq */
// import { App } from 'test/Utils'
// import { Connection } from 'mongoose'

// export class Database {
//   private app: App
//   private connection: Connection

//   constructor(app: App) {
//     this.app = app
//     this.connection = this.getConnection()
//   }

//   getConnection() {
//     return this.app.getInstance<Connection>('DatabaseConnection')
//   }

//   getRepository<Repository>(repository: any) {
//     return this.app.getInstance<Repository>(repository.name)
//   }

//   async closeConnection() {
//     await this.connection.close()
//   }

//   async truncate() {
//     const promises = []

//     const collections = await this.connection.db.collections()

//     collections.forEach(collection => {
//       promises.push(collection.deleteMany({}))
//     })

//     await Promise.all(promises)
//   }

//   async dropDatabase() {
//     await this.connection.db.dropDatabase()
//   }

//   async dropCollections(collections: string[]) {
//     const promises = []

//     collections.forEach(collection => {
//       promises.push(this.connection.collections[collection].drop())
//     })

//     await Promise.all(promises)
//   }
// }
