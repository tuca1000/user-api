import { Json } from '@secjs/utils'
import { ApiRequestContract } from '@secjs/contracts'
import { PipeTransform, Injectable } from '@nestjs/common'

@Injectable()
export class QueryParamsPipe implements PipeTransform {
  transform(object: any): ApiRequestContract {
    const apiRequest: ApiRequestContract = {
      isInternRequest: false,
      where: {},
      orderBy: {},
      includes: [],
      otherQueries: {},
    }

    Object.keys(object).forEach(key => {
      let value = object[key]

      if (value.startsWith('[') || value.startsWith('{')) {
        value = new Json().parse(value)
      }

      const whereKey = key.split('*')[1]
      const orderByKey = key.split('-')[1]
      const includesKey = key.split('_')[1]

      if (whereKey && value) {
        apiRequest.where[whereKey] = value

        return
      }

      if (orderByKey && value) {
        apiRequest.orderBy[orderByKey] = (value as 'ASC') || 'DESC'

        return
      }

      if (includesKey && value) {
        const include = { relation: includesKey, includes: [] }

        value.forEach(subRelation => {
          include.includes.push({ relation: subRelation })
        })

        if (!include.includes.length) delete include.includes

        apiRequest.includes.push(include)

        return
      }

      apiRequest.otherQueries[key] = value
    })

    return apiRequest
  }
}
