import { Type } from 'class-transformer'
import { IsNumber, IsOptional, Min } from 'class-validator'

export class PaginationDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  limit?: number
}
