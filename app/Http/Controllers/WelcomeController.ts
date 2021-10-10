import * as insomniaCollection from 'docs/Collection.json'

import { ApiTags } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import { getBranch, getCommitId } from '@secjs/utils'
import { Controller, Get, Render } from '@nestjs/common'

@Controller()
@ApiTags('Welcome')
export class WelcomeController {
  constructor(private configService: ConfigService) {}

  async response() {
    return {
      branch: await getBranch(),
      commit: await getCommitId(),
      greeting: `Welcome to ${this.configService.get('app.name')}!`,
      name: this.configService.get('app.name'),
      domain: this.configService.get('app.domain'),
      prefix: this.configService.get('app.prefix.name'),
      version: this.configService.get('app.version'),
      description: this.configService.get('app.description'),
      repository: this.configService.get('app.source'),
      documentation: this.configService.get('app.documentation'),
    }
  }

  @Get('/')
  @Render('main')
  async main() {
    return this.response()
  }

  @Get('/git')
  async prefix() {
    return this.response()
  }

  @Get('/welcome')
  async welcome() {
    return this.response()
  }

  @Get('/insomnia')
  async insomnia() {
    return insomniaCollection
  }

  @Get('/healthcheck')
  async healthcheck() {
    return this.response()
  }
}
