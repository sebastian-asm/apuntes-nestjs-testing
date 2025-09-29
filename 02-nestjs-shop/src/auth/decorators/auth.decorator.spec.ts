import { UseGuards, applyDecorators } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { ValidRoles } from '../../interfaces'
import { UseRoleGuard } from '../guards/use-role/use-role.guard'
import { RoleProtected } from './role-protected.decorator'
import { Auth } from './auth.decorator'

jest.mock('@nestjs/common', () => ({
  applyDecorators: jest.fn(),
  UseGuards: jest.fn()
}))

jest.mock('@nestjs/passport', () => ({
  AuthGuard: jest.fn()
}))

jest.mock('../guards/use-role/use-role.guard', () => ({
  UseRoleGuard: jest.fn()
}))

jest.mock('./role-protected.decorator', () => ({
  RoleProtected: jest.fn()
}))

describe('Auth Decorator', () => {
  it('should call apply decorators with RoleProtected and UseGuards', () => {
    const roles = [ValidRoles.ADMIN, ValidRoles.USER, ValidRoles.SUPER_USER]
    Auth(...roles)
    expect(applyDecorators).toHaveBeenCalledWith(
      RoleProtected(...roles),
      UseGuards(AuthGuard(), UseRoleGuard)
    )
  })
})
