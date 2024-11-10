import Post from '#models/post'
import User from '#models/user'
import { loginValidator, registerValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import db from '@adonisjs/lucid/services/db'

const di = 12
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

  public async registerUser({ request, response }: HttpContext) {
    try {
      const validatedData = await request.validateUsing(registerValidator,{
        meta:{
          userId:user.id
        }
      })
      const { name, email, password } = validatedData
      const existingUser = await User.findBy('email', email)
      if (existingUser) {
        return response.status(400).send({
          message: 'User with this email already exists',
        })
      }
      const user = await User.create({
        name,
        email,
        password,
      })
      // console.log(user)

      return response.status(200).send(user)
    } catch (error) {
      return response.status(400).send(error.message)
    }
  }
  public async loginUser({ request, response, auth }: HttpContext) {
    try {
      const validatedData = await loginValidator.validate(request.all())
      const { email, password } = validatedData

      const user = await User.findBy('email', email)
      if (!user) {
        return response.status(400).send({
          message: 'Invalid email or password',
        })
      }
      // check if user has a token
      // if(find){
      //   return response.status(400).send({
      //     message: 'User already logged in',
      // })
      // console.log(': fin : ', find)
      const token = await User.accessTokens.create(user, [
        'server:create',
        'server:read',
        'server:update',
        'server:delete',
      ])
      //  await User.accessTokens.delete(user, token.identifier)
      // console.log(user){}
      const passwordVerified = await hash.verify(user.password, password)
      //console.log(password, user.password, passwordVerified)
      if (!passwordVerified) {
        return response.status(400).send({
          message: 'Invalid email or password',
        })
      }
      await auth.use('web').login(user, !!request.input('remember_me')) // i added
      //console.log(auth.use('web').user)
      return response.status(200).send({
        user: user,
        token: token,
      })
    } catch (error) {
      return response.status(400).send({
        message: 'Failed to login',
        errors: error.messages || error.message,
      })
    }
  }
  async loggedUser({ response, auth }: HttpContext) {
    try {
      const loggeduser = auth.use('web').user
      console.log('this is user')
      return response.status(200).send(loggeduser)
    } catch (err) {
      return response.status(403).send('unauthrized')
    }
  }

  async log_out({ request, response, auth }: HttpContext) {
    try {
      // const user = await auth.use('api').authenticate()
      // const userId = user.currentAccessToken
      // console.log(userId)
      // await User.accessTokens.delete(user, user.currentAccessToken.identifier)
      await auth.use('web').logout()
      return response.status(200).send('Logged out successfully')
    } catch (err) {
      console.error(err)
      return response.status(403).send('Unauthorized')
    }
  }
}
