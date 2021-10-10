import { Inject, Injectable } from '@nestjs/common'
import { Seeder } from '@secjs/base/database/Seeder'
import { UserRepository } from 'app/Repositories/UserRepository'

@Injectable()
export class UserSeeder extends Seeder<any> {
  @Inject(UserRepository) protected repository: UserRepository
}
