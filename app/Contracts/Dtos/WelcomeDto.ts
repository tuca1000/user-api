import { ApiProperty } from '@nestjs/swagger'

export class WelcomeDto {
  @ApiProperty()
  test: string
}
