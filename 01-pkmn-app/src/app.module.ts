import { Module } from '@nestjs/common'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PkmnsModule } from './pkmns/pkmns.module'

@Module({
  imports: [PkmnsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
