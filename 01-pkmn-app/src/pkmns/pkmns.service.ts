import { Injectable, NotFoundException } from '@nestjs/common'

import { CreatePkmnDto } from './dto/create-pkmn.dto'
import { UpdatePkmnDto } from './dto/update-pkmn.dto'
import { PaginationDto } from 'src/shared/dto/pagination.dto'
import { PokeApiResponse } from './interfaces/pokeapi.interface'
import { PkmnResponse } from './interfaces/pkmn.interface'
import { Pkmn } from './entities/pkmn.entity'

@Injectable()
export class PkmnsService {
  paginationPkmnsCache = new Map<string, Pkmn[]>()

  create(createPkmnDto: CreatePkmnDto) {
    return Promise.resolve(`This action adds a new ${createPkmnDto.name}`)
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto
    const ofsfset = (page - 1) * limit
    const cacheKey = `${page}-${limit}`
    if (this.paginationPkmnsCache.has(cacheKey)) return this.paginationPkmnsCache.get(cacheKey)!
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${ofsfset}&limit=${limit}`
    const data = await fetch(url).then((response) => response.json() as Promise<PokeApiResponse>)
    const pkmnsPromises = data.results.map((result) => {
      const id = result.url.split('/').at(-2)!
      return this.getPkmnInfo(+id)
    })
    const pkmns = await Promise.all(pkmnsPromises)
    this.paginationPkmnsCache.set(cacheKey, await Promise.all(pkmns))
    return pkmns
  }

  findOne(id: number) {
    return this.getPkmnInfo(id)
  }

  update(id: number, updatePkmnDto: UpdatePkmnDto) {
    return Promise.resolve(`This action updates a #${id} pkmn`)
  }

  remove(id: number) {
    return Promise.resolve(`This action removes a #${id} pkmn`)
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
