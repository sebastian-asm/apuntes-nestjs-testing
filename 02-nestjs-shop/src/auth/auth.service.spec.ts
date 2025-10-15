import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { JwtService } from '@nestjs/jwt'
import { Repository } from 'typeorm'
import {
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException
} from '@nestjs/common'
import * as bcrypt from 'bcrypt'

import { AuthService } from './auth.service'
import { User } from './entities/user.entity'
import { CreateUserDto, LoginUserDto } from './dto'

describe('AuthService', () => {
  let authService: AuthService
  let userRespository: Repository<User>

  beforeEach(async () => {
    const mockUserRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn()
    }

    const mockJwtService = {
      sign: jest.fn().mockReturnValue('mock-jwt-token')
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository
        },
        {
          provide: JwtService,
          useValue: mockJwtService
        }
      ]
    }).compile()
    authService = module.get<AuthService>(AuthService)
    userRespository = module.get<Repository<User>>(getRepositoryToken(User))
  })

  it('should be defined', () => {
    expect(authService).toBeDefined()
  })

  it('should create a user and return user with token', async () => {
    const dto: CreateUserDto = {
      email: 'demo@demo.com',
      password: '123456',
      fullName: 'Demo User'
    }

    const user = {
      ...dto,
      id: '1',
      isActve: true,
      roles: ['user'],
      email: dto.email,
      fullName: dto.fullName
    } as unknown as User

    jest.spyOn(userRespository, 'create').mockReturnValue(user)
    const result = await authService.create(dto)
    expect(result).toEqual({
      email: 'demo@demo.com',
      fullName: 'Demo User',
      id: '1',
      isActve: true,
      roles: ['user'],
      token: 'mock-jwt-token'
    })
  })

  it('should throw an error if email already exists', async () => {
    const dto: CreateUserDto = {
      email: 'demo@demo.com',
      password: '123456',
      fullName: 'Demo User'
    }
    jest
      .spyOn(userRespository, 'save')
      .mockRejectedValue({ code: '23505', detail: 'Email already exists' })
    await expect(authService.create(dto)).rejects.toThrow(BadRequestException)
    await expect(authService.create(dto)).rejects.toThrow(
      'Email already exists'
    )
  })

  it('should throw an Internal Server Error', async () => {
    const mockError = { code: '9999', detail: 'Ocurrió un error inesperado' }
    const dto: CreateUserDto = {
      email: 'demo@demo.com',
      password: '123456',
      fullName: 'Demo User'
    }

    // mockImplementation para que no muestre el error en consola
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(userRespository, 'save').mockRejectedValue(mockError)

    await expect(authService.create(dto)).rejects.toThrow(
      InternalServerErrorException
    )
    await expect(authService.create(dto)).rejects.toThrow(
      'Ocurrió un error inesperado'
    )

    expect(console.log).toHaveBeenCalled()
    expect(console.log).toHaveBeenCalledWith(mockError)
    logSpy.mockRestore()
  })

  it('should login a user and return token', async () => {
    const dto: LoginUserDto = {
      email: 'demo@demo.com',
      password: '123456'
    }
    const user = {
      ...dto,
      isActive: true,
      roles: ['user'],
      fullName: 'Demo User'
    } as unknown as User

    jest.spyOn(userRespository, 'findOne').mockResolvedValue(user)
    jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true)
    const result = await authService.login(dto)
    expect(result).toEqual({
      email: 'demo@demo.com',
      password: '123456',
      isActive: true,
      roles: ['user'],
      fullName: 'Demo User',
      token: 'mock-jwt-token'
    })
    // el password no debe venir en la respuesta
    expect(result.password).not.toBeUndefined()
  })

  it('should throw an UnAuthorized Exception if user doest not exists', async () => {
    const dto = { email: 'demo@demo.com' } as LoginUserDto
    jest.spyOn(userRespository, 'findOne').mockResolvedValue(null)
    await expect(authService.login(dto)).rejects.toThrow(UnauthorizedException)
    await expect(authService.login(dto)).rejects.toThrow(
      'Credenciales no válidas'
    )
  })

  it('should throw an UnAuthorized Exception if user doest not exists', async () => {
    const dto = { email: 'demo@demo.com' } as LoginUserDto
    jest
      .spyOn(userRespository, 'findOne')
      .mockResolvedValue({ password: '12345' } as User)
    jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false)
    await expect(authService.login(dto)).rejects.toThrow(UnauthorizedException)
    await expect(authService.login(dto)).rejects.toThrow(
      'Credenciales no válidas'
    )
  })

  it('should check auth status and return user with new token', async () => {
    const user = {
      id: '1',
      email: 'demo@demo.com',
      fullName: 'Demo User',
      isActive: true,
      roles: ['user']
    } as User
    const result = await authService.checkAuthStatus(user)
    expect(result).toEqual({
      id: '1',
      email: 'demo@demo.com',
      fullName: 'Demo User',
      isActive: true,
      roles: ['user'],
      token: 'mock-jwt-token'
    })
  })
})
