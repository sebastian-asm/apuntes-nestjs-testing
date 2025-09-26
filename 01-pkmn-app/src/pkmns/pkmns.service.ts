import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'

import { CreatePkmnDto } from './dto/create-pkmn.dto'
import { UpdatePkmnDto } from './dto/update-pkmn.dto'
import { PaginationDto } from 'src/shared/dto/pagination.dto'
import { PokeApiResponse } from './interfaces/pokeapi.interface'
import { PkmnResponse } from './interfaces/pkmn.interface'
import { Pkmn } from './entities/pkmn.entity'

@Injectable()
export class PkmnsService {
  paginationPkmnsCache = new Map<string, Pkmn[]>()
  PkmnCache = new Map<number, Pkmn>()

  create(createPkmnDto: CreatePkmnDto) {
    const pkmn: Pkmn = {
      ...createPkmnDto,
      id: new Date().getTime(),
      hp: createPkmnDto.hp ?? 0,
      sprites: createPkmnDto.sprites ?? [],
    }
    this.PkmnCache.forEach((p) => {
      if (pkmn.name === p.name) throw new BadRequestException(`${pkmn.name} already exists`)
    })
    this.PkmnCache.set(pkmn.id, pkmn)
    return Promise.resolve(pkmn)
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto
    const offset = (page - 1) * limit
    const cacheKey = `${page}-${limit}`
    if (this.paginationPkmnsCache.has(cacheKey)) return this.paginationPkmnsCache.get(cacheKey)!
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    const data = await fetch(url).then((response) => response.json() as Promise<PokeApiResponse>)
    const pkmnsPromises = data.results.map((result) => {
      const id = result.url.split('/').at(-2)!
      return this.getPkmnInfo(+id)
    })
    const pkmns = await Promise.all(pkmnsPromises)
    this.paginationPkmnsCache.set(cacheKey, await Promise.all(pkmns))
    return pkmns
  }

  async findOne(id: number) {
    if (this.PkmnCache.has(id)) return this.PkmnCache.get(id)
    const pkmn = await this.getPkmnInfo(id)
    if (!pkmn) throw new NotFoundException(`Pkmn with id ${id} not found`)
    this.PkmnCache.set(id, pkmn)
    return pkmn
  }

  async update(id: number, updatePkmnDto: UpdatePkmnDto) {
    const pkmn = await this.findOne(id)
    const updatedPkmn = { ...pkmn!, ...updatePkmnDto }
    this.PkmnCache.set(id, updatedPkmn)
    return Promise.resolve(updatedPkmn)
  }

  async remove(id: number) {
    await this.findOne(id)
    this.PkmnCache.delete(id)
    return Promise.resolve('Pkmn removed')
  }

  private async getPkmnInfo(id: number): Promise<Pkmn> {
    const result = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    if (result.status === 404) throw new NotFoundException(`Pkmn with id ${id} not found`)
    const data = (await result.json()) as PkmnResponse
    return {
      id: data.id,
      name: data.name,
      type: data.types[0].type.name,
      hp: data.stats[0].base_stat,
      sprites: [data.sprites.front_default, data.sprites.back_default],
    }
  }
}
