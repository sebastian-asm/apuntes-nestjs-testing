import { Module } from '@nestjs/common'

import { PkmnsService } from './pkmns.service'
import { PkmnsController } from './pkmns.controller'

@Module({
  controllers: [PkmnsController],
  providers: [PkmnsService],
})
export class PkmnsModule {}
