import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common'

import { ModuleRef } from '@nestjs/core'
import { PipeValidatorContract } from 'app/Contracts/PipeValidatorContract'

@Injectable()
export class PipeValidator<T> implements PipeValidatorContract {
  @Inject(ModuleRef)
  private moduleRef: ModuleRef

  async transform(value: any, metadata: any) {
    const validator = this.moduleRef.get(metadata.metatype.validator)

    return this.validate(validator, metadata.metatype.type, value)
  }

  async validate(validator: any, type: string, value: Partial<T>) {
    const errorMessages = await validator.validateAll(value, type)

    if (!errorMessages || !errorMessages.length) return value

    throw new UnprocessableEntityException({
      name: 'Unprocessable Entity Error',
      message: errorMessages,
      statusCode: 422,
    })
  }
}
