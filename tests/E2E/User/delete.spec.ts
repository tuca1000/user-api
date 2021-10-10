import * as request from 'supertest'

import { Debug } from '@secjs/logger'
import { AppModule } from 'app/AppModule'
import { App, Database } from 'tests/Utils'
import { UserFactory } from 'database/factories/UserFactory'

describe('\n[E2E] User ❌', () => {
  it('should delete one user', async () => {
    const user = await userFactory.create()

    const status = 200
    const method = 'DELETE'
    const path = `/users/${user.id}`

    const { body } = await request(app.server.getHttpServer())
      .delete(path)
      .expect(status)

    expect(body.method).toBe(method)
    expect(body.status).toBe(status)
    expect(body.data.id).toBe(user.id)
    expect(body.data.deletedAt).toBeTruthy()
  })

  it('should throw a not found error when can not find user', async () => {
    const status = 404
    const method = 'DELETE'
    const path = `/users/507f1f77bcf86cd799439011`

    const { body } = await request(app.server.getHttpServer())
      .delete(path)
      .expect(status)

    expect(body.method).toBe(method)
    expect(body.status).toBe(status)
    expect(body.error).toEqual({
      isSecJsException: true,
      name: 'NotFoundException',
      message: {
        error: 'Not Found Error',
        message: 'NOT_FOUND_PROJECT',
        statusCode: status,
      },
    })
  })
})

let app: App
let database: Database
let userFactory: UserFactory

beforeEach(async () => {
  Debug(`Executing ${beforeEach.name}`, 'api:test')

  app = await new App([AppModule]).initApp()
  database = new Database(app)

  userFactory = app.getInstance(UserFactory)
})

afterEach(async () => {
  Debug(`Executing ${afterEach.name}`, 'api:test')

  await database.truncate()
  await database.truncateCache()
  await app.closeApp()
})
