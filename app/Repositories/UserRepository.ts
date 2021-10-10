import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from 'app/Schemas/User'
import { MongooseRepository } from '@secjs/base/repositories/MongooseRepository'

@Injectable()
export class UserRepository extends MongooseRepository<UserDocument> {
  wheres = []
  relations = []

  @InjectModel(User.name)
  model: Model<UserDocument>
}
