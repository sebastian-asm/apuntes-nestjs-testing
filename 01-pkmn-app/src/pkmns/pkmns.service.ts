import { Injectable } from '@nestjs/common'

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
    return 'This action adds a new pkmn'
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
    return `This action returns a #${id} pkmn`
  }

  update(id: number, updatePkmnDto: UpdatePkmnDto) {
    return `This action updates a #${id} pkmn`
  }

  remove(id: number) {
    return `This action removes a #${id} pkmn`
  }

  private async getPkmnInfo(id: number): Promise<Pkmn> {
    const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(
      (res) => res.json() as Promise<PkmnResponse>,
    )
    return {
      id: data.id,
      name: data.name,
      type: data.types[0].type.name,
      hp: data.stats[0].base_stat,
      sprites: [data.sprites.front_default, data.sprites.back_default],
    }
  }
}
