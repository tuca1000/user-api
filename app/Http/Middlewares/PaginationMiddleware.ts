import {
  Inject,
  Injectable,
  NestMiddleware,
  RequestMethod,
} from '@nestjs/common'

import { ConfigService } from '@nestjs/config'
import { RouteMiddleware } from 'app/Contracts/RouteMiddlewareContract'

@Injectable()
export class PaginationMiddleware implements NestMiddleware {
  @Inject(ConfigService) private configService: ConfigService

  static get routes(): RouteMiddleware[] {
    return [{ path: '/examples', method: RequestMethod.GET }]
  }

  use(req, res, next) {
    const page = req.query.page ? parseInt(req.query.page) : 0
    const limit = req.query.limit ? parseInt(req.query.limit) : 10
    const resourceUrl = `${this.configService.get('app.domain')}${req.baseUrl}`

    req.pagination = {
      page,
      limit,
      resourceUrl,
    }

    next()
  }
}
