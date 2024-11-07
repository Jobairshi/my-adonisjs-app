import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class BasicAuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const authHeader = ctx.request.header('authorization')

    if (!authHeader) {
      ctx.response.header('WWW-Authenticate', 'Basic')
      return ctx.response.status(401).send('Authorization required')
    }

    const base64Credentials = authHeader.split(' ')[1]
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
    const [username, password] = credentials.split(':')

    // Verify username and password
    if (username === 'admin' && password === '1111') {
      await next()
    } else {
      ctx.response.header('WWW-Authenticate', 'Basic')
      return ctx.response.status(401).send('Invalid credentials')
    }
  }
}
