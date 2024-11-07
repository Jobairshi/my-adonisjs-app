import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { ApplicationContract } from '@ioc:Adonis/Core/Application'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API Title',
      version: '1.0.0',
      description: 'API documentation',
    },
  },
  apis: ['./start/routes.ts'], // Path to the API docs
}

const swaggerSpec = swaggerJSDoc(options)

export default class SwaggerProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
  }

  public boot() {
    const Server = this.app.container.use('Adonis/Core/Server')
    Server.instance.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
