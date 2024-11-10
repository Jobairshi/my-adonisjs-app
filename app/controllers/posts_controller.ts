import type { HttpContext } from '@adonisjs/core/http'

import Post from '#models/post'
import Comment from '#models/comment'
import User from '#models/user'
import Reply from '#models/reply'
import Reaction from '#models/reaction'
import repl from '@adonisjs/core/services/repl'

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
      const user = await auth.use('api').authenticate()
      if (user) {
        const content = {
          content: request.input('content'),
          user_id: user.id,
        }
        return response.status(201).send(await user.related('posts').create(content))
      }
      return response.status(403).send('unauthorized')
    } catch (error) {
      return response.status(404).send('it is here', error.message)
    }
  }
  async insertComment({ request, response, auth }: HttpContext) {
    try {
      const { postId, content } = request.all()
      const comment = new Comment()
      const user = await auth.use('api').authenticate()
      if (user) {
        comment.user_id = user.id
        comment.post_id = postId
        comment.content = content
        return response.status(201).send(await comment.save())
      }
      return response.status(403).send('unauthorized')
    } catch (err) {
      return response.status(404).send(err.message)
    }
  }
  async insertReply({ request, response, auth }: HttpContext) {
    try {
      const { commentId, content, postId } = request.all()
      const reply = new Reply()
      const userId = auth.use('web').user?.id
      if (userId) {
        reply.userId = userId
        reply.commentId = commentId
        reply.content = content
        reply.postId = postId
        return response.status(201).send(await reply.save())
      }
      return response.status(403).send('unauthorized')
    } catch (err) {
      return response.status(500).send(err.message)
    }
  }
  async getAllPost({ request, response }: HttpContext) {
    try {
      // const limit = Number(request.input('limit', 10))
      // const page = Number(request.input('page', 1))
      const allPost = await Post.query()
        .preload('comments', (qu) => {
          qu.preload('replies')
        })
        .preload('reactions')
        .preload('user')
        .orderBy('id', 'desc')
      return response.status(200).send(allPost)
    } catch (err) {
      response.status(500).send(err.message)
    }
  }
  async getPostByLimit({ request, response }: HttpContext) {
    try {
      const limit = Number(request.input('limit', 10))
      const page = Number(request.input('page', 1))
      console.log(limit, page)
      const allPost = await Post.query()
        .preload('comments', (qu) => {
          qu.preload('replies')
        })
        .preload('reactions')
        .preload('user')
        .orderBy('id', 'desc')
        .paginate(page, limit)
      return response.status(200).send(allPost)
    } catch (err) {
      response.status(500).send(err.message)
    }
  }
  async getCommentByPostId({ params, response }: HttpContext) {
    try {
      const postId = params.postId
      //  console.log(postId)
      const answer = await Comment.query().where('post_id', postId)
      return response.status(200).send(answer)
    } catch (err) {
      return response.status(500).send(err.message)
    }
  }
  async toggleReaction({ request, response, auth }: HttpContext) {
    const { postId, reactionType } = request.all()
    console.log(postId, reactionType)
    const userId = auth.use('web').user?.id
    if (!userId) {
      return response.status(403).send('unauthorized')
    }
    const reaction = await Reaction.query()
      .where('user_id', userId)
      .where('post_id', postId)
      .first()
    if (reaction) {
      await reaction.delete()
      return response.status(200).send({ message: 'Reaction removed' })
    }
    return response
      .status(200)
      .send(await Reaction.create({ userId: userId, postId: postId, type: reactionType }))
  }
  async deletePost({ request, response }: HttpContext) {
    try {
      const postId = request.input('postId')
      const del = await Post.query().where('id', postId).delete()
      if (del) {
        return response.status(200).send('Post deleted successfully')
      }
      return response.status(404).send('Post not found')
    } catch (err) {
      return response.status(500).send(err.message)
    }
  }
  async editPost({ request, response }: HttpContext) {
    try {
      const postId = request.input('postId')
      const post = await Post.findOrFail(postId)
      post.content = request.input('content')
      await post.save()
      return response.status(200).send('Post updated successfully')
    } catch (err) {
      return response.status(500).send(err.message)
    }
  }
}
