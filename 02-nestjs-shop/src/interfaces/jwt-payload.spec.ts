import { JwtPayload } from './jwt-payload'

describe('JWtPayload Interfce', () => {
  it('should return true for a valid payload', () => {
    const id = 'abc12345'
    const validPayload: JwtPayload = { id }
    expect(validPayload.id).toBe(id)
  })
})
