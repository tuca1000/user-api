import { Inject, Injectable } from '@nestjs/common'
import { BaseService } from '@secjs/base/services/BaseService'
import { UserResource } from 'app/Resources/UserResource'
import { UserRepository } from 'app/Repositories/UserRepository'

@Injectable()
export class UserService extends BaseService<any> {
  protected resourceName = 'user'
  protected resource = new UserResource()

  @Inject(UserRepository) protected repository: UserRepository
}
