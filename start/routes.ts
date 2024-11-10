/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
const UsersController = () => import('#controllers/users_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import User from '#models/user'
import '../app/controllers/post/post_routes.js'
import { HttpContextExtender } from '../app/interfaces/interface_exporter.js'

router.on('/').render('pages/home')
router.get('/csrf', async ({ request }) => {
  return request.csrfToken
})

router.post('/login', [UsersController, 'loginUser'])
// router.post('/login', [UsersController, 'login'])
router.post('/register', [UsersController, 'registerUser'])
router.get('/logged-user', [UsersController, 'loggedUser']).use(middleware.auth())
router.post('/log-out', [UsersController, 'log_out']).use(middleware.auth())

router.post('users/:id/tokens', async ({ params }) => {
  const user = await User.findOrFail(params.id)
  const token = await User.accessTokens.create(user, ['server:create', 'server:read'])

  return token
})
router
  .get('/tokens', async ({ auth }) => {
    return User.accessTokens.all(auth.user!)
  })
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )

router
  .get('lets-stuck', async (ctx) => {
    ctx.response.send({ user: ctx.user_info, loction: ctx.location })
  })
  .use(middleware.userLocation())
