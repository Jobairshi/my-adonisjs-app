import { HttpContext } from '@adonisjs/core/http'
export interface HttpContextExtender extends HttpContext {
  user_info: string
  location: string
}
