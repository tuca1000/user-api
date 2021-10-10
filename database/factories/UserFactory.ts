import { Inject, Injectable } from '@nestjs/common'
import { Factory } from '@secjs/base/database/Factory'
import { UserSeeder } from 'database/seeds/UserSeeder'

@Injectable()
export class UserFactory extends Factory<any> {
  @Inject(UserSeeder) protected seeder: UserSeeder

  blueprint = () => {
    return {
      example: this.faker.name.findName(),
    }
  }

  fakeBlueprint = () => {
    return {
      id: this.faker.datatype.uuid(),
      name: this.faker.name.findName(),
      status: 'pendent',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    }
  }
}
