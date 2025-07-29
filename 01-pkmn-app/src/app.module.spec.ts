import { Test, TestingModule } from '@nestjs/testing'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PkmnsModule } from './pkmns/pkmns.module'
import { AppModule } from './app.module'

describe('AppModule', () => {
  let appController: AppController
  let appService: AppService
  let pkmnsModule: PkmnsModule

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()
    appController = moduleRef.get<AppController>(AppController)
    appService = moduleRef.get<AppService>(AppService)
    pkmnsModule = moduleRef.get<PkmnsModule>(PkmnsModule)
  })

  it('should be defined', () => {
    expect(appController).toBeDefined()
    expect(appService).toBeDefined()
    expect(pkmnsModule).toBeDefined()
  })
})
