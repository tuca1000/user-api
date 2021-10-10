import {
  PipeTransform,
  Injectable,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common'

import { ObjectId } from 'mongodb'
import { isValidObjectId } from 'mongoose'

@Injectable()
export class ObjectIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value === 'object') {
      Object.keys(value).forEach(key => this.validateObjectId(value[key], key))

      return value
    }

    this.validateObjectId(value, metadata.data)

    return new ObjectId(value)
  }

  validateObjectId(id, key) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException({
        key: key,
        value: id,
        message: 'INVALID_OBJECT_ID',
      })
    }
  }
}
