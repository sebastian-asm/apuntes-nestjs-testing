import { validate } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import 'reflect-metadata'

import { PaginationDto } from './pagination.dto'

describe('PaginationDto', () => {
  it('should validate pagination parameters', async () => {
    const dto = new PaginationDto()
    const errors = await validate(dto)
    expect(errors.length).toBe(0)
  })

  it('should validate with valid data', async () => {
    const dto = new PaginationDto()
    dto.page = 1
    dto.limit = 10
    const errors = await validate(dto)
    expect(errors.length).toBe(0)
  })

  it('should not validate with invalid page', async () => {
    const dto = new PaginationDto()
    dto.page = -1
    const errors = await validate(dto)
    errors.forEach((error) => {
      if (error.property === 'page') expect(error.constraints?.min).toBeDefined()
      else expect(true).toBeFalsy()
    })
  })

  it('should not validate with invalid limit', async () => {
    const dto = new PaginationDto()
    dto.limit = 0
    const errors = await validate(dto)
    errors.forEach((error) => {
      if (error.property === 'limit') expect(error.constraints?.min).toBeDefined()
      else expect(true).toBeFalsy()
    })
  })

  it('should cover strings into numbers', async () => {
    const input = { limit: '10', page: '1' }
    const dto = plainToInstance(PaginationDto, input)
    const errors = await validate(dto)
    expect(errors.length).toBe(0)
    expect(dto.page).toBe(1)
    expect(dto.limit).toBe(10)
  })
})
