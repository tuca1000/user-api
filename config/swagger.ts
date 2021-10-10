import appConfig from './app'
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger'

export interface ISwaggerConfig {
  prefix: string
  createDocument: (app: any) => OpenAPIObject
}

export default {
  prefix: `${appConfig.prefix.name}/swagger`,
  createDocument: app =>
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle(appConfig.name)
        .setDescription(appConfig.description)
        .setVersion(appConfig.version)
        // .addApiKey({ type: 'apiKey', name: 'apiKey', in: 'query' }, 'apiKey')
        .build(),
      {},
    ),
} as ISwaggerConfig
