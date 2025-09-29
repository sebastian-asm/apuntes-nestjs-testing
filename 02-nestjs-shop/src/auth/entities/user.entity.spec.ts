import { User } from './user.entity'

describe('UserEntity', () => {
  it('should create and user instance', () => {
    const user = new User()
    expect(user).toBeInstanceOf(User)
  })

  it('should clear email before save', () => {
    const user = new User()
    user.email = '  DEMO@demo.com  '
    user.emailLowerCase()
    expect(user.email).toBe('demo@demo.com')
  })

  it('should clear email before update', () => {
    const user = new User()
    user.email = '   demo@DEMO.com '
    user.updatEmailLowerCase()
    expect(user.email).toBe('demo@demo.com')
  })
})
