import { Injectable } from '@nestjs/common'
import { Validator } from '@secjs/validator'

@Injectable()
export class UserValidator extends Validator {
  createSchema = () => {
    return {
      name: 'string|required',
    }
  }

  updateSchema = () => {
    return {
      name: 'string',
    }
  }
}
