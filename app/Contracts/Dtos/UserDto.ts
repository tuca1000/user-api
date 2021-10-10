// import { ApiProperty } from '@nestjs/swagger'
import { UserValidator } from 'app/Validators/UserValidator'

export class CreateUserDto {
  static type = 'createSchema'
  static validator = UserValidator

  // @ApiProperty()
  // User Props in here
}

export class UpdateUserDto {
  static type = 'updateSchema'
  static validator = UserValidator

  // @ApiProperty()
  // User Props in here
}
