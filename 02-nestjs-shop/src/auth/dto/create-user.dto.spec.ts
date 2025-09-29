import { validate } from 'class-validator'

import { CreateUserDto } from './create-user.dto'

describe('CreateUserDTO', () => {
  it('should have the correct properties', async () => {
    const dto = new CreateUserDto()
    dto.email = 'demo@demo.com'
    dto.password = '123456aA'
    dto.fullName = 'Demo User'
    const errors = await validate(dto)
    expect(errors.length).toBe(0)
  })

  it('should throw errors if password is not valid', async () => {
    const dto = new CreateUserDto()
    dto.email = 'demo@demo.com'
    dto.password = '123'
    dto.fullName = 'Demo User'
    const errors = await validate(dto)
    const passError = errors.find((e) => e.property === 'password')
    expect(passError).toBeDefined()
    expect(passError.constraints).toBeDefined()
    expect(passError.constraints.matches).toBe(
      'La contraseña debe tener mayúsculas, minúsculas y un número'
    )
  })
})
