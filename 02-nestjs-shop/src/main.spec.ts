import { NestFactory } from '@nestjs/core'

import { bootstrap } from './main'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: jest.fn().mockResolvedValue({
      useGlobalPipes: jest.fn(),
      setGlobalPrefix: jest.fn(),
      listen: jest.fn(),
      enableCors: jest.fn()
    })
  }
}))

jest.mock('@nestjs/common', () => ({
  ValidationPipe: jest.requireActual('@nestjs/common').ValidationPipe
}))

jest.mock('@nestjs/swagger', () => ({
  DocumentBuilder: jest.fn().mockReturnValue({
    // mockReturnThis: devuelve la misma instancia
    setTitle: jest.fn().mockReturnThis(),
    setDescription: jest.fn().mockReturnThis(),
    setVersion: jest.fn().mockReturnThis(),
    build: jest.fn().mockReturnThis()
  }),
  ApiProperty: jest.fn(),
  SwaggerModule: {
    createDocument: jest.fn().mockReturnValue('document'),
    setup: jest.fn()
  }
}))

jest.mock('./app.module', () => ({
  AppModule: jest.fn().mockReturnValue('AppModule')
}))

describe('main.ts', () => {
  let mockApp: {
    useGlobalPipes: jest.Mock
    setGlobalPrefix: jest.Mock
    listen: jest.Mock
    enableCors: jest.Mock
  }

  beforeEach(() => {
    mockApp = {
      useGlobalPipes: jest.fn(),
      setGlobalPrefix: jest.fn(),
      listen: jest.fn(),
      enableCors: jest.fn()
    }
    ;(NestFactory.create as jest.Mock).mockResolvedValue(mockApp)
  })

  it('should create the app with AppModule', async () => {
    await bootstrap()
    expect(NestFactory.create).toHaveBeenCalledWith(AppModule)
  })

  it('should create the app with env.PORT', async () => {
    await bootstrap()
    process.env.PORT = '3000'
    expect(mockApp.listen).toHaveBeenCalledWith(+process.env.PORT)
  })

  it('should set global prefix', async () => {
    await bootstrap()
    expect(mockApp.setGlobalPrefix).toHaveBeenCalledWith('api')
  })

  it('should set global pipes', async () => {
    await bootstrap()
    expect(mockApp.useGlobalPipes).toHaveBeenCalledWith(
      expect.objectContaining({
        errorHttpStatusCode: 400,
        validatorOptions: {
          forbidNonWhitelisted: true,
          forbidUnknownValues: false,
          whitelist: true
        }
      })
    )
  })

  it('should call DocumentBuilder', async () => {
    await bootstrap()
    expect(DocumentBuilder).toHaveBeenCalled()
    expect(DocumentBuilder).toHaveBeenCalledWith()
  })

  it('should create swagger document', async () => {
    await bootstrap()
    expect(SwaggerModule.createDocument).toHaveBeenCalled()
    expect(SwaggerModule.setup).toHaveBeenCalledWith(
      'api',
      expect.anything(),
      'document'
    )
  })
})
