import {
  Catch,
  HttpStatus,
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common'

import { IErrorMappers } from 'config/app'
import { Request, Response } from 'express'
import { Logger, Debug } from '@secjs/logger'
import { ConfigService } from '@nestjs/config'

export interface IFullException {
  name?: string
  message?: string | any
  status?: number
  stack?: string
  isSecJsException?: boolean
}

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private errorMappers: IErrorMappers
  private logger = new Logger(AllExceptionFilter.name)

  constructor(private configService: ConfigService) {
    this.errorMappers = this.configService.get('app.errorMappers')
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    const fullException = this.filterException(exception)

    if (fullException.message === 'Cannot GET /favicon.ico') return

    Debug({ exception: fullException }, 'api:exception')

    const env = this.configService.get('app.environment')

    if (['development', 'production'].includes(env)) {
      this.logger.error({
        code: fullException.name,
        path: request.route?.path,
        method: request.method,
        status: fullException.status,
        timestamp: new Date().toISOString(),
        error: fullException,
      })
    }

    const error = {
      ...fullException,
    }

    if (env !== 'development') {
      delete error.stack
    }

    delete error.status

    const responseError: any = {
      code: fullException.name,
      path: request.route?.path,
      method: request.method,
      status: fullException.status,
      timestamp: new Date().toISOString(),
      error,
    }

    return response.status(fullException.status).json(responseError)
  }

  filterException(exception: any): IFullException {
    const fullException: IFullException = {
      name: exception.name,
      message: exception.getResponse
        ? exception.getResponse()
        : 'Internal Server Error',
      status: exception.getStatus
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR,
      stack: exception.stack,
    }

    if (exception.isSecJsException) return this.errorMappers.secJs(exception)

    return fullException
  }
}
