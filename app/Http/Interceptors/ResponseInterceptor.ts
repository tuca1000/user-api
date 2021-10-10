import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'

import { Request } from 'express'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  constructor(private configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp()
    const request = ctx.getRequest<Request>()
    const defaultResponses = {
      code: 'RESPONSE',
      path: request.route?.path,
      method: request.method,
      status: context.switchToHttp().getResponse().statusCode,
    }

    if (this.configService.get('view.routes').includes(request.path))
      return next.handle()

    return next.handle().pipe(
      map(data => {
        if (data.data && data.meta) {
          return {
            ...defaultResponses,
            data: data.data,
            meta: data.meta,
            links: data.links,
          }
        }

        return { ...defaultResponses, data }
      }),
    )
  }
}
