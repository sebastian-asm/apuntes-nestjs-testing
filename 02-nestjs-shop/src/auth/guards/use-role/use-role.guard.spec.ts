import { Reflector } from '@nestjs/core'
import {
  BadRequestException,
  ExecutionContext,
  ForbiddenException
} from '@nestjs/common'

import { UseRoleGuard } from './use-role.guard'

describe('UserRole Guard', () => {
  let guard: UseRoleGuard
  let reflector: Reflector
  let mockContent: ExecutionContext

  beforeEach(() => {
    reflector = new Reflector()
    guard = new UseRoleGuard(reflector)
    mockContent = {
      switchToHttp: jest.fn().mockReturnValue({ getRequest: jest.fn() }),
      getHandler: jest.fn()
    } as unknown as ExecutionContext
  })

  it('should return true if no roles are present', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(undefined)
    // el true es lo que devuelve el guard
    expect(guard.canActivate(mockContent)).toBe(true)
  })

  it('should return true if no roles are required', () => {
    jest.spyOn(reflector, 'get').mockReturnValue([])
    expect(guard.canActivate(mockContent)).toBe(true)
  })

  it('should throw BadRequestException if user is not found', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['admin'])
    // objeto vacio para simular que no hay usuario
    jest.spyOn(mockContent.switchToHttp(), 'getRequest').mockReturnValue({})
    expect(() => guard.canActivate(mockContent)).toThrow(BadRequestException)
    expect(() => guard.canActivate(mockContent)).toThrow(
      'Usuario no encontrado'
    )
  })

  it('should return true if user has a valid role', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['admin'])
    jest.spyOn(mockContent.switchToHttp(), 'getRequest').mockReturnValue({
      user: { roles: ['admin'] }
    })
    expect(guard.canActivate(mockContent)).toBe(true)
  })

  it('should throw ForbiddenException if user lacks required role', () => {
    const user = { roles: ['user'], fullName: 'Demo' }
    jest.spyOn(reflector, 'get').mockReturnValue(['admin'])
    jest
      .spyOn(mockContent.switchToHttp(), 'getRequest')
      .mockReturnValue({ user })
    expect(() => guard.canActivate(mockContent)).toThrow(ForbiddenException)
    expect(() => guard.canActivate(mockContent)).toThrow(
      `El usuario ${user.fullName} no tiene los permisos necesarios`
    )
  })
})
