import { ArgumentMetadata } from '@nestjs/common/interfaces/features/pipe-transform.interface'

export interface PipeValidatorContract<T = any> {
  /**
   * Method to implement a custom validator pipe. Called with two parameters
   *
   * @param value argument before it is received by route handler method
   * @param metadata contains metadata about the value
   */
  transform(value: T, metadata: ArgumentMetadata): Promise<T>

  /**
   * Method to validate parameters transformed by transform
   *
   * @param validator validator class extended from @secjs/validator.Validator
   * @param type the validation type that is going to be used, default createSchema
   * @param value argument before it is received by route handler method
   */
  validate(validator: any, type: string, value: T | any | any[]): Promise<T>
}
