import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'
import { Repository } from 'typeorm'

import { JwtStrategy } from './jwt'
import { User } from '../entities/user.entity'
import { JwtPayload } from 'src/interfaces'
import { UnauthorizedException } from '@nestjs/common'

describe('JwtStrategy', () => {
  let strategy: JwtStrategy
  let userRepository: Repository<User>

  beforeEach(async () => {
    const mockUserRepository = { findOneBy: jest.fn() }
    const mockConfigService = {
      get: jest.fn().mockReturnValue('test-jwt-secret')
    }
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository
        },
        {
          provide: ConfigService,
          useValue: mockConfigService
        }
      ]
    }).compile()
    strategy = module.get<JwtStrategy>(JwtStrategy)
    userRepository = module.get<Repository<User>>(getRepositoryToken(User))
  })

  it('should be defined', () => {
    expect(strategy).toBeDefined()
  })

  it('should validate and return user if exists and is active', async () => {
    const payload: JwtPayload = { id: '123' }
    const mockUser = { id: '123', isActive: true } as User
    // mockReturnValur = sincrono
    // mockResolvedValue = asincrono
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockUser)
    const result = await strategy.validate(payload)
    expect(result).toEqual(mockUser)
    expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: payload.id })
  })

  it('should throw Unauthorized Exception if user does not exists', async () => {
    const payload: JwtPayload = { id: '123' }
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null)
    await expect(strategy.validate(payload)).rejects.toThrow(
      UnauthorizedException
    )
    await expect(strategy.validate(payload)).rejects.toThrow(
      'Hubo un problema al iniciar sesión'
    )
  })

  it('should throw Unauthorized Exception if user is not active', async () => {
    const payload: JwtPayload = { id: '123' }
    const mockUser = { id: '123', isActive: false } as User
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockUser)
    await expect(strategy.validate(payload)).rejects.toThrow(
      UnauthorizedException
    )
    await expect(strategy.validate(payload)).rejects.toThrow(
      'Hubo un problema al iniciar sesión'
    )
  })
})
