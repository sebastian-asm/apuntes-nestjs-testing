import { Test, TestingModule } from '@nestjs/testing'
import { BadRequestException, NotFoundException } from '@nestjs/common'

import { PkmnsService } from './pkmns.service'

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
    expect(result).toEqual({
      hp: 0,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      id: expect.any(Number),
      name: 'Pikachu',
      sprites: [],
      type: 'Electric',
    })
  })

  it('should throw an error if pkmn exists', async () => {
    const data = { name: 'Pikachu', type: 'Electric' }
    await service.create(data)
    try {
      await service.create(data)
      expect(true).toBeFalsy()
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(error.message).toBe(`${data.name} already exists`)
    }
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

  it('should return a pkmn from cache', async () => {
    const cacheSpy = jest.spyOn(service.PkmnCache, 'get')
    const id = 1
    await service.findOne(id)
    await service.findOne(id)
    expect(cacheSpy).toHaveBeenCalledTimes(1)
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

  it('should return pkmns from cache', async () => {
    const cacheSpy = jest.spyOn(service.paginationPkmnsCache, 'get')
    const fetchSpy = jest.spyOn(global, 'fetch')
    await service.findAll({ page: 1, limit: 10 }) // se graba en cache
    await service.findAll({ page: 1, limit: 10 }) // se obtiene de cache
    expect(cacheSpy).toHaveBeenCalled()
    expect(cacheSpy).toHaveBeenCalledWith('1-10')
    expect(fetchSpy).toHaveBeenCalledTimes(11)
  })

  it('should update pkmn', async () => {
    const id = 1
    const updatePkmnDto = { name: 'updated-bulbasaur' }
    const updatedPkmn = await service.update(id, updatePkmnDto)
    expect(updatedPkmn).toEqual({
      id: 1,
      name: updatePkmnDto.name,
      type: 'grass',
      hp: 45,
      sprites: [
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png',
      ],
    })
  })

  it('should not update pkmn if not exists', async () => {
    const id = 12345
    const updatePkmnDto = { name: 'updated-bulbasaur' }
    try {
      await service.update(id, updatePkmnDto)
      expect(true).toBeFalsy()
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(error.message).toBe(`Pkmn with id ${id} not found`)
    }
  })

  it('should removed pkmn from cache', async () => {
    const id = 1
    await service.findOne(id)
    await service.remove(id)
    expect(service.PkmnCache.get(id)).toBeUndefined()
  })
})
