import router from '@adonisjs/core/services/router'
const PostsController = () => import('./posts_controller.js')
import { middleware } from '#start/kernel'

router
  .group(() => {
    router.post('/insert-post', [PostsController, 'insertPost']).use(
      middleware.auth({
        guards: ['web'],
      })
    )
    router.post('/insert-comment', [PostsController, 'insertComment']).use(
      middleware.auth({
        guards: ['web'],
      })
    )
    router.post('/insert-reply', [PostsController, 'insertReply']).use(middleware.auth())

    router.get('/all-post', [PostsController, 'getAllPost']).use(
      middleware.auth({
        guards: ['web'],
      })
    )
    router.delete('/delete-post', [PostsController, 'deletePost']).use(middleware.auth())
    router.get('/all-post-comment/:postId', [PostsController, 'getCommentByPostId']).use(
      middleware.auth({
        guards: ['web'],
      })
    )
    router.post('/add-reaction', [PostsController, 'toggleReaction']).use(middleware.auth())
    router.get('/limit-post', [PostsController, 'getPostByLimit']).use(
      middleware.auth({
        guards: ['web'],
      })
    )
    router.put('/update-post', [PostsController, 'editPost']).use(middleware.auth())
  })
  .prefix('/posts')
  .middleware([middleware.auth({ guards: ['web'] })])
