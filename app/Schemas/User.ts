import * as mongoose from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, default: 'pendent' })
  status: 'pendent' | 'canceled' | 'active' | 'deleted'

  @Prop({ type: Date, default: null })
  deletedAt?: Date

  createdAt: Date

  updatedAt: Date
}

export type UserDocument = User & mongoose.Document
export const UserSchema = SchemaFactory.createForClass(User)
