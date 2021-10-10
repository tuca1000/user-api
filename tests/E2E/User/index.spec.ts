import * as request from 'supertest'

import { Debug } from '@secjs/logger'
import { AppModule } from 'app/AppModule'
import { App, Database } from 'tests/Utils'
import { UserFactory } from 'database/factories/UserFactory'

describe('\n[E2E] User 🗒', () => {
  it('should return all users paginated and filtered', async () => {
    const page = 0
    const limit = 1

    const status = 200
    const method = 'GET'
    const path = `/users?page=${page}&limit=${limit}&*deletedAt=null`

    await userFactory.count(2).create()
    await userFactory.count(2).deleted().create()

    const { body } = await request(app.server.getHttpServer())
      .get(path)
      .expect(status)

    expect(body.method).toBe(method)
    expect(body.status).toBe(status)
    expect(body.data[0].id).toBeTruthy()
    expect(body.data[0]._id).toBeFalsy()
    expect(body.data[0].__v).toBeFalsy()
    expect(body.meta.itemCount).toBe(body.data.length)
    expect(body.meta.totalItems).toBe(2)
    expect(body.meta.totalPages).toBe(2)
    expect(body.meta.currentPage).toBe(page)
    expect(body.meta.itemsPerPage).toBe(limit)
  })

  it('should throw an error when trying to filter by values not authorized in the model user', async () => {
    const status = 422
    const method = 'GET'
    const path = `/users?*testetwoe=hello`

    const { body } = await request(app.server.getHttpServer())
      .get(path)
      .expect(status)

    expect(body.method).toBe(method)
    expect(body.status).toBe(status)
    expect(body.error).toEqual({
      isSecJsException: true,
      name: 'UnprocessableEntityException',
      message: {
        error: 'Unprocessable Entity Error',
        message: 'It is not possible to filter by testetwoe',
        statusCode: status,
      },
    })
  })

  it('should throw an error when trying to include relations not authorized in the model user', async () => {
    const status = 422
    const method = 'GET'
    const path = `/users?_testetwoe=[]`

    const { body } = await request(app.server.getHttpServer())
      .get(path)
      .expect(status)

    expect(body.method).toBe(method)
    expect(body.status).toBe(status)
    expect(body.error).toEqual({
      isSecJsException: true,
      name: 'UnprocessableEntityException',
      message: {
        error: 'Unprocessable Entity Error',
        message: 'It is not possible to include testetwoe relation',
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
