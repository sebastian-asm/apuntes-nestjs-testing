import { Test, TestingModule } from '@nestjs/testing'

import { PkmnsService } from './pkmns.service'
import { NotFoundException } from '@nestjs/common'

describe('PkmnsService', () => {
  let service: PkmnsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PkmnsService],
    }).compile()
    service = module.get<PkmnsService>(PkmnsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should create a new pkmn', async () => {
    const data = { name: 'Pikachu', type: 'Electric' }
    const result = await service.create(data)
    expect(result).toBe(`This action adds a new ${data.name}`)
  })

  it('should return pkmn if exists', async () => {
    const id = 1
    const result = await service.findOne(id)
    expect(result).toEqual({
      id: 1,
      name: 'bulbasaur',
      type: 'grass',
      hp: 45,
      sprites: [
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png',
      ],
    })
  })

  it('should return 404 error pkmn not found', async () => {
    const id = 9999
    await expect(service.findOne(id)).rejects.toThrow(NotFoundException)
  })

  it('should find all pkmns and cache them', async () => {
    const pkmns = await service.findAll({ page: 1, limit: 10 })
    expect(pkmns).toBeInstanceOf(Array)
    expect(pkmns.length).toBe(10)
    expect(service.paginationPkmnsCache.has('1-10')).toBeTruthy()
    expect(service.paginationPkmnsCache.get('1-10')).toEqual(pkmns)
  })

  it('should check properties of the pkmn', async () => {
    const id = 1
    const result = await service.findOne(id)
    expect(result).toHaveProperty('id')
    expect(result).toHaveProperty('name')
    expect(result).toEqual(
      expect.objectContaining({
        id,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        hp: expect.any(Number),
      }),
    )
  })
})
