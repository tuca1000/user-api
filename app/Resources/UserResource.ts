// import { isArrayOfObjects } from '@secjs/utils'
import { UserDocument } from 'app/Schemas/User'

export interface UserJson {
  id: string
  status: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

export class UserResource {
  toJson(model: UserDocument): UserJson {
    if (!model) return null

    const json: UserJson = {
      id: model._id.toString(),
      status: model.status,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      deletedAt: model.deletedAt,
    }

    // For OneToMany relation
    // if (model.relations && isArrayOfObjects(model.relations)) {
    //   json.relations = new YourRelationResource().toArray(
    //     model.relations,
    //   )
    // }

    // For ManyToOne relation
    // if (document.project?.toJSON()?._id) {
    //   json.relation = new YourRelationResource().toJson(document.relation)
    // }

    return json
  }

  toArray(models: UserDocument[]): UserJson[] {
    return models.map(model => this.toJson(model))
  }
}
