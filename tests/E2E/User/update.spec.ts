import * as request from 'supertest'

import { Debug } from '@secjs/logger'
import { AppModule } from 'app/AppModule'
import { App, Database } from 'tests/Utils'
import { UserFactory } from 'database/factories/UserFactory'

describe('\n[E2E] User 🛠', () => {
  it('should update one user', async () => {
    const user = await userFactory.create()

    const status = 200
    const method = 'PUT'
    const path = `/users/${user.id}`

    const payload = {
      name: 'test',
    }

    const { body } = await request(app.server.getHttpServer())
      .put(path)
      .send(payload)
      .expect(status)

    expect(body.method).toBe(method)
    expect(body.status).toBe(status)
    expect(body.data.id).toBe(user.id)
    expect(body.data.name).toBe(payload.name)
  })

  it('should throw a not found error when can not find user', async () => {
    const status = 404
    const method = 'PUT'
    const path = `/users/507f1f77bcf86cd799439011`

    const { body } = await request(app.server.getHttpServer())
      .put(path)
      .send({ name: 'test' })
      .expect(status)

    expect(body.method).toBe(method)
    expect(body.status).toBe(status)
    expect(body.error).toEqual({
      isSecJsException: true,
      name: 'NotFoundException',
      message: {
        error: 'Not Found Error',
        message: 'NOT_FOUND_USER',
        statusCode: status,
      },
    })
  })

  // Implement all properties in app/Validators/UserValidator.ts
  // And create tests to validate if the schema validator are working well.

  // it('should throw validation errors when trying to update a user with validation errors', async () => {
  //   const status = 422
  //   const path = `/users/507f1f77bcf86cd799439011`
  //
  //   const { body } = await request(app.server.getHttpServer())
  //     .put(path)
  //     .send({ name: true })
  //     .expect(status)
  //
  //   expect(body.status).toBe(status)
  //   expect(body.error.message).toStrictEqual({
  //     name: 'Unprocessable Entity Error',
  //     statusCode: status,
  //     message: [
  //       {
  //         field: 'name',
  //         message: 'string validation failed on name',
  //         validation: 'string',
  //       },
  //     ],
  //   })
  // })
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
