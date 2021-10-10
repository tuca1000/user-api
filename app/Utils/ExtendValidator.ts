import { ModuleRef } from '@nestjs/core'
import { Validator } from '@secjs/validator'
import { ConfigService } from '@nestjs/config'
import { Injectable, NotImplementedException } from '@nestjs/common'

@Injectable()
export class ExtendValidator {
  private validator: Validator

  constructor(
    private moduleRef: ModuleRef,
    private configService: ConfigService,
  ) {
    this.validator = new Validator()

    this.validator.extendAsync('unique', this.unique)
    this.validator.extendAsync('exists', this.exists)
  }

  unique = async (data: any, field: string, args: string[]) => {
    const repository = this.getRepository(args[0])

    const model = await repository.getOne(null, {
      where: { [field]: this.validator.getValue(data, field) },
    })

    return !model
  }

  exists = async (data: any, field: string, args: string[]) => {
    const repository = this.getRepository(args[1])

    const model = await repository.getOne(null, {
      where: { [args[0]]: this.validator.getValue(data, field) },
    })

    return !!model
  }

  private getRepository(name: string) {
    const repository = this.moduleRef.get(
      this.configService.get(`database.tables.${name}`),
    )

    if (!repository) {
      throw new NotImplementedException(
        'Repository not implemented inside database config file.',
      )
    }

    return repository
  }
}
