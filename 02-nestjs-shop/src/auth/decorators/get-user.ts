import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException
} from '@nestjs/common'

export const getUser = (data: string, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest()
  const user = req.user

  if (!user)
    throw new InternalServerErrorException(
      'Error al obtener el usuario desde la request'
    )

  return !data ? user : user[data]
}

export const GetUser = createParamDecorator(getUser)
