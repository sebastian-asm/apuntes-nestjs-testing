import { ExecutionContext, InternalServerErrorException } from '@nestjs/common'

import { getUser } from './get-user'

describe('GetUser Decorator', () => {
  const mockUser = { id: '1', name: 'Test User' }
  const mockExecutionContext = {
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        user: { id: mockUser.id, name: mockUser.name }
      })
    })
  } as unknown as ExecutionContext

  it('should return the user from the request', () => {
    const result = getUser(null, mockExecutionContext)
    expect(result).toEqual({ id: mockUser.id, name: mockUser.name })
  })

  it('should return the user name from the request', () => {
    const result = getUser('name', mockExecutionContext)
    expect(result).toEqual(mockUser.name)
  })

  it('should throw and Internal Server Error if user not found', () => {
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user: null
        })
      })
    } as unknown as ExecutionContext
    try {
      getUser(null, mockExecutionContext)
      expect(true).toBe(false)
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerErrorException)
      expect(error.message).toBe('Error al obtener el usuario desde la request')
    }
  })
})
