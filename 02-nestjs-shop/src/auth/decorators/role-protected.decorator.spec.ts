import { SetMetadata } from '@nestjs/common'

import { ValidRoles } from '../../interfaces'
import { META_ROLES, RoleProtected } from './role-protected.decorator'

jest.mock('@nestjs/common', () => ({
  // alternativa 1
  // SetMetadata: jest.fn().mockImplementation((key, value) => ({ key, value }))

  // alternativa 2
  SetMetadata: jest.fn()
}))

describe('RoleProtected', () => {
  it('should set metadata with the correct roles', () => {
    const roles = [ValidRoles.ADMIN, ValidRoles.USER, ValidRoles.SUPER_USER]
    // alternativa 1
    // const result = RoleProtected(...roles)
    // expect(result).toEqual({ key: META_ROLES, value: roles })

    // alternativa 2
    RoleProtected(...roles)
    expect(SetMetadata).toHaveBeenCalled()
    expect(SetMetadata).toHaveBeenCalledWith(META_ROLES, roles)
  })
})
