import { ExecutionContext, createParamDecorator } from '@nestjs/common'

export const getRawHeaders = (ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest()
  return req.rawHeaders
}

export const RawHeaders = createParamDecorator(getRawHeaders)
