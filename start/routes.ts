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

router.on('/').render('pages/home')
router.get('/csrf', async ({ request }) => {
  return request.csrfToken
})
router.get('/question-1', [PostsController, 'questionOne'])
router.get('/question-2', [PostsController, 'questionTwo'])
router.get('/question-3', [PostsController, 'questionThree'])
router.delete('/question-4', [PostsController, 'questionFour'])
router.post('/insert-post', [PostsController, 'insertPost'])
router.post('/insert-comment', [PostsController, 'insertComment'])
router.post('/insert-reply', [PostsController, 'insertReply'])
router.post('/login', [UsersController, 'login'])
