import { Debugger } from '@secjs/logger'

import { RouteMiddleware } from 'app/Contracts/RouteMiddlewareContract'
import { Injectable, NestMiddleware, RequestMethod } from '@nestjs/common'

@Injectable()
export class LogHttpMiddleware implements NestMiddleware {
  private debug = new Debugger('api:requests')

  static get routes(): RouteMiddleware[] {
    return [{ path: '*', method: RequestMethod.ALL }]
  }

  use(req, res, next) {
    const url = req.url
    const method = req.method
    const rateLimit = req.rateLimit

    this.debug.debug(`${method} - ${url}`)
    this.debug.debug({ rateLimit: rateLimit })

    next()
  }
}
