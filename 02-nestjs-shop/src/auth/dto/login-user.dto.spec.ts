import { validate } from 'class-validator'
import { plainToClass } from 'class-transformer'

import { LoginUserDto } from './login-user.dto'

describe('LoginUserDTO', () => {
  it('should have the correct properties', async () => {
    // otra alternativa
    const dto = plainToClass(LoginUserDto, {
      email: 'demo@demo.com',
      password: '123456aA'
    })
    const errors = await validate(dto)
    expect(errors.length).toBe(0)
  })

  it('should throw errors if password is not valid', async () => {
    const dto = plainToClass(LoginUserDto, {
      email: 'demo@demo.com',
      password: '123',
      fullName: 'Demo User'
    })

    const errors = await validate(dto)
    const passError = errors.find((e) => e.property === 'password')
    expect(passError).toBeDefined()
    expect(passError.constraints).toBeDefined()
    expect(passError.constraints.matches).toBe(
      'La contraseña debe tener mayúsculas, minúsculas y un número'
    )
  })
})
