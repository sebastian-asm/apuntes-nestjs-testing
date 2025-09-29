import { ValidRoles } from './valid-roles'

describe('Valid Roles', () => {
  it('should have correct values', () => {
    expect(ValidRoles.ADMIN).toBe('admin')
    expect(ValidRoles.SUPER_USER).toBe('super_user')
    expect(ValidRoles.USER).toBe('user')
  })

  it('should contain all expected keys', () => {
    const keyToHave = ['ADMIN', 'SUPER_USER', 'USER']
    expect(Object.keys(ValidRoles)).toEqual(expect.arrayContaining(keyToHave))
  })
})
