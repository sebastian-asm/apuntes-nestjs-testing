import { PartialType } from '@nestjs/mapped-types'

import { CreatePkmnDto } from './create-pkmn.dto'

export class UpdatePkmnDto extends PartialType(CreatePkmnDto) {}
