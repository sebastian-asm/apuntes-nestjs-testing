import { ExecutionContext, createParamDecorator } from '@nestjs/common'

import { getRawHeaders } from './raw-headers'

jest.mock('@nestjs/common', () => ({
  // createParamDecorator: jest.fn().mockImplementation(() => jest.fn())
  createParamDecorator: jest.fn()
}))

describe('RawHeader Decorator', () => {
  const mockExecutionContext = {
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        rawHeaders: ['Authorization', 'Bearer Token', 'header3']
      })
    })
  } as unknown as ExecutionContext

  it('should return the raw headers from the request', () => {
    const result = getRawHeaders(mockExecutionContext)
    expect(result).toEqual(['Authorization', 'Bearer Token', 'header3'])
  })

  it('should call createParamDecorator with getRawHeaders', () => {
    expect(createParamDecorator).toHaveBeenCalledWith(getRawHeaders)
  })
})
