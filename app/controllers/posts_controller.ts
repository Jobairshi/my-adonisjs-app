import type { HttpContext } from '@adonisjs/core/http'

import Post from '#models/post'
import Comment from '#models/comment'
import User from '#models/user'
import Reply from '#models/reply'

export default class PostsController {
  async questionOne({ response }: HttpContext) {
    try {
      const answer = await Post.query()
        .preload('user', (qu) => qu.select('name'))
        .withCount('comments')
        .withCount('reactions')
      const flat = answer.map((post) => post.serialize())
      return flat
    } catch (err) {
      return response.status(500).send(err.message)
    }
  }
  async questionTwo({ request, response }: HttpContext) {
    try {
      const postId = request.input('post_id')
      const answer = await Comment.query()
        .where('comments.post_id', postId)
        .select('comments.id', 'comments.content', 'comments.post_id', 'comments.user_id')
        .withCount('reactions')
        .preload('user', (qu) => qu.select('name'))
        .groupBy('comments.id')
      return answer
    } catch (err) {
      return response.status(500).send(err.message)
    }
  }
  async questionThree({ response }: HttpContext) {
    try {
      const answer = await User.query()
        .select('id')
        .withCount('posts')
        .orderBy('posts_count', 'desc')
      return answer
    } catch (err) {
      return response.status(500).send(err.message)
    }
  }
  async questionFour({ request, response }: HttpContext) {
    try {
      const id = request.input('post_id')
      const answer = await Post.query().delete().where('id', id)
      console.log(answer)
      if (answer[0]) {
        return response.status(200).send('Post deleted successfully')
      }
      return response.status(404).send('Post not found')
    } catch (err) {
      return response.status(500).send(err.message)
    }
  }
  public async insertPost({ request, response, auth }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      if (user) {
        const content = {
          content: request.input('content'),
          user_id: user.id,
        }
        //await user.related('posts').create(content)
        return response.status(201).send({ message: 'usered is here', user })
      }
    } catch (error) {
      return response.status(400).send({
        message: 'Failed to create post',
        errors: error.messages || error.message,
      })
    }
  }
  async insertComment({ request, response, auth }: HttpContext) {
    try {
      const { postId, content } = request.all()
      const userId = auth.use('web').user?.id
      const comment = new Comment()
      if (userId) {
        comment.user_id = userId
        comment.post_id = postId
        comment.content = content
        await comment.save()
        return response.status(201).send(comment)
      }
      return response.status(403).send('unauthorized')
    } catch (err) {
      return response.status(404).send(err.message)
    }
  }
  async insertReply({ request, response, auth }: HttpContext) {
    try {
      const { commentId, content } = request.all()
      const reply = new Reply()
      const userId = auth.use('web').user?.id
      if (userId) {
        reply.userId = userId
        reply.commentId = commentId
        reply.content = content
        await reply.save()
        return response.status(201).send(reply)
      }
      return response.status(403).send('unauthorized')
    } catch (err) {
      return response.status(500).send(err.message)
    }
  }
  async getAllPost({ response }: HttpContext) {
    try {
      const allPost = await Post.query().select('*').orderBy('id', 'desc')
      return response.status(200).send(allPost)
    } catch (err) {
      response.status(500).send(err.message)
    }
  }
}
