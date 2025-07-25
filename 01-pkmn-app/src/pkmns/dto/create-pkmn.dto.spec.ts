import { validate } from 'class-validator'

import { CreatePkmnDto } from './create-pkmn.dto'

describe('CreatePkmnDto', () => {
  it('should be valid with correct data', async () => {
    const dto = new CreatePkmnDto()
    dto.name = 'Pikachu'
    dto.type = 'Electric'
    const errors = await validate(dto)
    expect(errors.length).toBe(0)
  })

  it('should be invalid if name is not present', async () => {
    const dto = new CreatePkmnDto()
    dto.type = 'Electric'
    const errors = await validate(dto)
    const nameError = errors.find((error) => error.property === 'name')
    expect(nameError).toBeDefined()
  })

  it('should be invalid if type is not present', async () => {
    const dto = new CreatePkmnDto()
    dto.name = 'Pikachu'
    const errors = await validate(dto)
    const typeError = errors.find((error) => error.property === 'type')
    expect(typeError).toBeDefined()
  })

  it('should hp must be positive number', async () => {
    const dto = new CreatePkmnDto()
    dto.name = 'Pikachu'
    dto.type = 'Electric'
    dto.hp = -10
    const errors = await validate(dto)
    const hpError = errors.find((error) => error.property === 'hp')
    const constraints = hpError?.constraints
    expect(hpError).toBeDefined()
    // toEqual para comprar objetos
    expect(constraints).toEqual({ min: 'hp must not be less than 0' })
  })

  it('should be invalid with non-string sprites', async () => {
    const dto = new CreatePkmnDto()
    dto.name = 'Pikachu'
    dto.type = 'Electric'
    dto.sprites = [123, 321] as unknown as string[]
    const errors = await validate(dto)
    const spritesError = errors.find((error) => error.property === 'sprites')
    const constraints = spritesError?.constraints
    expect(spritesError).toBeDefined()
    expect(constraints).toEqual({ isString: 'each value in sprites must be a string' })
  })
})
