import { sum } from './sum.helper'

// agrupador
describe('sum.helper.ts', () => {
  // se recomienda el uso del "it" en vez de "test" al utilizar Nest
  it('should return the sum of two numbers', () => {
    // Arrange
    const num1 = 5
    const num2 = 10

    // Act
    const result = sum(num1, num2)

    // Assert
    expect(result).toBe(15)
  })
})
