import { Test, TestingModule } from '@nestjs/testing'

import { PkmnsController } from './pkmns.controller'
import { PkmnsService } from './pkmns.service'
import { PaginationDto } from 'src/shared/dto/pagination.dto'
import { Pkmn } from './entities/pkmn.entity'

const mockPkmns: Pkmn[] = [
  {
    id: 1,
    name: 'bulbasaur',
    type: 'grass',
    hp: 45,
    sprites: [
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png',
    ],
  },
  {
    id: 2,
    name: 'ivysaur',
    type: 'grass',
    hp: 60,
    sprites: [
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png',
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/2.png',
    ],
  },
]

describe('PkmnsController', () => {
  let controller: PkmnsController
  let service: PkmnsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PkmnsController],
      providers: [PkmnsService],
    }).compile()

    controller = module.get<PkmnsController>(PkmnsController)
    service = module.get<PkmnsService>(PkmnsService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should have called the service with correct parameter', async () => {
    const dto: PaginationDto = { limit: 10, page: 1 }

    // espía: está pendiente de algo
    jest.spyOn(service, 'findAll')

    await controller.findAll(dto)
    // expect(service.findAll).toHaveBeenCalled()

    // verificar que el servicio fue llamado
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(service.findAll).toHaveBeenCalledWith(dto)
  })

  it('should have called the service and check the result', async () => {
    const dto: PaginationDto = { limit: 10, page: 1 }
    jest.spyOn(service, 'findAll').mockImplementation(() => Promise.resolve(mockPkmns))
    const pkmns = await controller.findAll(dto)
    expect(pkmns).toEqual(mockPkmns)
  })

  it('should have called the service with the correct id (findOne)', async () => {
    const id = '1'
    const [pkmn] = mockPkmns
    const spy = jest.spyOn(service, 'findOne').mockImplementation(() => Promise.resolve(pkmn))
    const result = await controller.findOne(id)
    expect(spy).toHaveBeenCalledWith(+id)
    expect(result).toBe(pkmn)
  })

  it('should have called the service with the correct id and data (update)', async () => {
    const id = '1'
    const updatePkmnDto = { name: 'updated-bulbasaur' }
    jest.spyOn(service, 'update').mockImplementation(() => Promise.resolve(mockPkmns[0]))
    await controller.update(id, updatePkmnDto)
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(service.update).toHaveBeenCalledWith(+id, updatePkmnDto)
  })

  it('should have called delete with the correct id (delete)', async () => {
    const id = '1'
    jest
      .spyOn(service, 'remove')
      .mockImplementation(() => Promise.resolve(`This action removes a #${id} pkmn`))
    const result = await controller.remove(id)
    expect(result).toBe(`This action removes a #${id} pkmn`)
  })

  it('should call create service method', async () => {
    jest.spyOn(service, 'create').mockImplementation(() => Promise.resolve(mockPkmns[0]))
    await controller.create({ name: 'demo', type: 'demo' })
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(service.create).toHaveBeenLastCalledWith({ name: 'demo', type: 'demo' })
  })
})
