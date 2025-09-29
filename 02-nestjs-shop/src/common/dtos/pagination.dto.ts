import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsIn, IsOptional, IsPositive, Min } from 'class-validator'

export class PaginationDto {
  validate() {
    throw new Error('Method not implemented.')
  }

  @ApiProperty({ default: 10, description: 'Limite de productos para listar' })
  @IsOptional()
  @IsPositive()
  // tranformado la query params de string a number
  @Type(() => Number)
  limit?: number

  @ApiProperty({
    default: 0,
    description: 'Cantidad de productos a saltar por cada página'
  })
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset?: number

  @ApiProperty({
    default: '',
    description: 'Filter results by gender'
  })
  @IsOptional()
  @IsIn(['men', 'women', 'unisex', 'kid'])
  gender: 'men' | 'women' | 'unisex' | 'kid'
}
