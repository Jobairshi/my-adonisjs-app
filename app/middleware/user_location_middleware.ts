import type { NextFn } from '@adonisjs/core/types/http'

import { HttpContext } from '@adonisjs/core/http';

export default class UserLocationMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    console.log(ctx.request.ip().toString())

    /**
     * Call next method in the pipeline and return its output
     */
    ctx.location = 'here'
    ctx.user_info = 'chittagong'
    const newctx = {
      ...ctx,
      phone: '123231',
    }
    ctx = newctx
    ctx.response.send(ctx.phone)
    const output = await next()
    return output
  }
}
