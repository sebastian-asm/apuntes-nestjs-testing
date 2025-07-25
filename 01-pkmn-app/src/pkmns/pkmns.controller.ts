import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'

import { PkmnsService } from './pkmns.service'
import { CreatePkmnDto } from './dto/create-pkmn.dto'
import { UpdatePkmnDto } from './dto/update-pkmn.dto'
import { PaginationDto } from '../shared/dto/pagination.dto'

@Controller('pkmns')
export class PkmnsController {
  constructor(private readonly pkmnsService: PkmnsService) {}

  @Post()
  create(@Body() createPkmnDto: CreatePkmnDto) {
    return this.pkmnsService.create(createPkmnDto)
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.pkmnsService.findAll(paginationDto)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pkmnsService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePkmnDto: UpdatePkmnDto) {
    return this.pkmnsService.update(+id, updatePkmnDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pkmnsService.remove(+id)
  }
}
