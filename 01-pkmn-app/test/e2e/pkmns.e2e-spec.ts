/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { App } from 'supertest/types'

import { AppModule } from '../../src/app.module'
import { Pkmn } from 'src/pkmns/entities/pkmn.entity'

describe('Pkmns (e2e)', () => {
  let app: INestApplication<App>

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    await app.init()
  })

  it('/pkmns (POST) - with no body', async () => {
    // return request(app.getHttpServer()).post('/pkmns').expect(200).expect('Hello World!')
    const response: request.Response = await request(app.getHttpServer()).post('/pkmns')
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const message = (response.body?.message as string[]) ?? []
    const errors = [
      'name must be a string',
      'name should not be empty',
      'type must be a string',
      'type should not be empty',
    ]
    expect(response.statusCode).toBe(400)
    expect(errors.length).toBe(message.length)
    expect(message).toEqual(expect.arrayContaining(errors))
  })

  it('/pkmns (POST) - with valid body', async () => {
    const response: request.Response = await request(app.getHttpServer())
      .post('/pkmns')
      .send({ name: 'demo', type: 'demo' })
      .expect(201)
    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      name: 'demo',
      type: 'demo',
      hp: 0,
      sprites: [],
      id: expect.any(Number),
    })
  })

  it('/pkmns (GET) - should return paginated list of pkmns', async () => {
    const response: request.Response = await request(app.getHttpServer())
      .get('/pkmns')
      .query({ limit: 5, page: 1 })
    expect(response.statusCode).toBe(200)
    expect(response.body).toBeInstanceOf(Array)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(response.body.length).toBe(5)
    ;(response.body as Pkmn[]).forEach((pkmn) => {
      expect(pkmn).toHaveProperty('name')
      expect(pkmn).toHaveProperty('type')
    })
  })

  it('/pkmns/:id (GET) - should return pkmn by Id', async () => {
    const pkmnId = 6
    const response: request.Response = await request(app.getHttpServer()).get(`/pkmns/${pkmnId}`)
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      id: 6,
      name: 'charizard',
      type: 'fire',
      hp: expect.any(Number),
      sprites: expect.any(Array),
    })
  })

  it('/pkmns/:id (GET) - should return Not Found', async () => {
    const pkmnId = 9999
    const response: request.Response = await request(app.getHttpServer()).get(`/pkmns/${pkmnId}`)
    expect(response.statusCode).toBe(404)
    expect(response.body).toEqual({
      statusCode: 404,
      message: `Pkmn with id ${pkmnId} not found`,
      error: 'Not Found',
    })
  })

  it('/pkmns/:id (PATCH) - should return update pkmn', async () => {
    const pkmnId = 1
    const dto = { name: 'bulbasaur-updated' }
    const response: request.Response = await request(app.getHttpServer())
      .patch(`/pkmns/${pkmnId}`)
      .send(dto)
    const updatedPkmn: Pkmn = response.body
    expect(response.statusCode).toBe(200)
    expect(updatedPkmn.name).toBe(dto.name)
  })

  it('/pkmns/:id (PATCH) - should return Throw an 404', async () => {
    const pkmnId = 9999
    const response: request.Response = await request(app.getHttpServer())
      .patch(`/pkmns/${pkmnId}`)
      .send({})
    expect(response.statusCode).toBe(404)
  })

  it('/pkmns/:id (DELETE) - should delete pkmn', async () => {
    const pkmnId = 1
    const response: request.Response = await request(app.getHttpServer()).delete(`/pkmns/${pkmnId}`)
    expect(response.statusCode).toBe(200)
    expect(response.text).toEqual('Pkmn removed')
  })
})
