import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  async login({ request, response }: HttpContext) {
    const { email, password } = request.body()
    console.log(email)
    const found = await User.query().where('email', email).where('password', password).first()
    if (found) {
      return response.status(200).send(found)
    }
    return response.status(404).send('User not found')
  }
}
