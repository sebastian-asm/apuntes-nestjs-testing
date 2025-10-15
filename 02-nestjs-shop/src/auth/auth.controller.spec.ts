import { Test, TestingModule } from '@nestjs/testing'
import { PassportModule } from '@nestjs/passport'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { CreateUserDto, LoginUserDto } from './dto'
import { User } from './entities/user.entity'

describe('AuthController', () => {
  let authController: AuthController
  let authService: AuthService

  beforeEach(async () => {
    const mockAuthService = {
      create: jest.fn(),
      login: jest.fn(),
      checkAuthStatus: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }]
    }).compile()
    authController = module.get<AuthController>(AuthController)
    authService = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(authController).toBeDefined()
  })

  it('should create user with the property DTO', async () => {
    const dto: CreateUserDto = {
      email: 'demo@demo.com',
      password: 'abc123',
      fullName: 'Demo User'
    }
    await authController.create(dto)
    expect(authService.create).toHaveBeenCalledWith(dto)
  })

  it('should login user with the property DTO', async () => {
    const dto: LoginUserDto = {
      email: 'demo@demo.com',
      password: 'abc123'
    }
    await authController.login(dto)
    expect(authService.login).toHaveBeenCalledWith(dto)
  })

  it('should check-user status with the property DTO', async () => {
    const user = {
      email: 'demo@demo.com',
      password: 'abc123',
      fullName: 'Demo User'
    } as User
    await authController.checkAuthStatus(user)
    expect(authService.checkAuthStatus).toHaveBeenCalledWith(user)
  })

  it('should return private route data', async () => {
    const user = {
      id: '1',
      email: 'demo@demo.com',
      fullName: 'Demo User'
    } as User
    const rawHeaders = ['header1: value1', 'header2: value2']
    const result = authController.testingPrivateRoute(
      user,
      user.email,
      rawHeaders
    )
    expect(result).toEqual({
      user: { id: '1', email: 'demo@demo.com', fullName: 'Demo User' },
      email: 'demo@demo.com',
      rawHeaders: ['header1: value1', 'header2: value2']
    })
  })
})
