/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const PostsController = () => import('#controllers/posts_controller')
const UsersController = () => import('#controllers/users_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import User from '#models/user'

router.on('/').render('pages/home')
router.get('/csrf', async ({ request }) => {
  return request.csrfToken
})
router.get('/question-1', [PostsController, 'questionOne']).use(middleware.auth())
router.get('/question-2', [PostsController, 'questionTwo'])
router.get('/question-3', [PostsController, 'questionThree'])
router.delete('/question-4', [PostsController, 'questionFour'])
router.post('/insert-post', [PostsController, 'insertPost']).use(
  middleware.auth({
    guards: ['api'],
  })
)
router.post('/insert-comment', [PostsController, 'insertComment']).use(
  middleware.auth({
    guards: ['api'],
  })
)
router.post('/insert-reply', [PostsController, 'insertReply']).use(middleware.auth())
router.post('/login', [UsersController, 'loginUser'])
// router.post('/login', [UsersController, 'login'])
router.post('/register', [UsersController, 'registerUser'])
router.get('/logged-user', [UsersController, 'loggedUser']).use(middleware.auth())
router.post('/log-out', [UsersController, 'log_out']).use(middleware.auth())
router.get('/all-post', [PostsController, 'getAllPost']).use(
  middleware.auth({
    guards: ['api'],
  })
)
router.delete('/delete-post', [PostsController, 'deletePost']).use(middleware.auth())
router.get('/all-post-comment/:postId', [PostsController, 'getCommentByPostId']).use(
  middleware.auth({
    guards: ['api'],
  })
)
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
router.post('/add-reaction', [PostsController, 'toggleReaction']).use(middleware.auth())
router.get('/limit-post', [PostsController, 'getPostByLimit']).use(
  middleware.auth({
    guards: ['api'],
  })
)
router.put('/update-post', [PostsController, 'editPost']).use(middleware.auth())
