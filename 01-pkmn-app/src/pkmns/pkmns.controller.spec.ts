import { Test, TestingModule } from '@nestjs/testing'

import { PkmnsController } from './pkmns.controller'
import { PkmnsService } from './pkmns.service'

describe('PkmnsController', () => {
  let controller: PkmnsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PkmnsController],
      providers: [PkmnsService],
    }).compile()

    controller = module.get<PkmnsController>(PkmnsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
