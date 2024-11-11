import type { HttpContext } from '@adonisjs/core/http'

import Post from '#models/post'
import Comment from '#models/comment'
import User from '#models/user'
import post_service from './post_service.js'
import {
  addReactionValidator,
  deletePostValidator,
  insertCommentValidator,
  insertPostValidator,
  insertReplyValidator,
  updatePostValidator,
} from './post_validator.js'

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
      const user = await auth.use('web').authenticate()
      const payload = await request.validateUsing(insertPostValidator)
      if (user) {
        const post = await post_service.insertPost(user.id, payload.content)
        return response.status(201).send(post)
      }
      return response.status(403).send('unauthorized')
    } catch (error) {
      return response.status(404).send(error.messages)
    }
  }
  async insertComment({ request, response, auth }: HttpContext) {
    try {
      const user = await auth.use('web').authenticate()
      const payload = await request.validateUsing(insertCommentValidator)
      if (user) {
        const comment = post_service.insertComment(user.id, payload.postId, payload.content)
        return response.status(201).send(comment)
      }
      return response.status(403).send('unauthorized')
    } catch (err) {
      return response.status(404).send(err.messages)
    }
  }
  async insertReply({ request, response, auth }: HttpContext) {
    try {
      const payload = await request.validateUsing(insertReplyValidator)
      const userId = auth.use('web').user?.id
      if (userId) {
        const reply = post_service.insertReply(
          userId,
          payload.commentId,
          payload.postId,
          payload.content
        )
        return response.status(201).send(reply)
      }
      return response.status(403).send('unauthorized')
    } catch (err) {
      return response.status(500).send(err.messages)
    }
  }
  async getAllPost({ response }: HttpContext) {
    try {
      const allPost = await post_service.getAllPost()
      console.log(allPost)
      return response.status(200).send(allPost)
    } catch (err) {
      response.status(500).send(err.messages)
    }
  }
  async getPostByLimit({ request, response }: HttpContext) {
    try {
      const limit = Number(request.input('limit', 10))
      const page = Number(request.input('page', 1))
      // console.log(limit, page)
      const allPost = await post_service.getPostByLimit(limit, page)
      return response.status(200).send(allPost)
    } catch (err) {
      response.status(500).send(err.messages)
    }
  }
  async getCommentByPostId({ params, response }: HttpContext) {
    try {
      const postId = params.postId
      //  console.log(postId)
      const answer = await post_service.getCommentByPostId(postId)
      return response.status(200).send(answer)
    } catch (err) {
      return response.status(500).send(err.messages)
    }
  }
  async toggleReaction({ request, response, auth }: HttpContext) {
    const { postId, reactionType } = request.all()
    console.log(postId, reactionType)
    const userId = auth.use('web').user?.id
    const payload = await request.validateUsing(addReactionValidator)
    if (!userId) {
      return response.status(403).send('unauthorized')
    }
    const reaction = await post_service.toggleReaction(userId, payload.postId, payload.reactionType)
    return response.status(200).send(reaction)
  }
  async deletePost({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(deletePostValidator)
      const del = await post_service.deletePost(payload.postId)
      return response.status(200).send(del)
    } catch (err) {
      return response.status(500).send(err.messages)
    }
  }
  async editPost({ request, response }: HttpContext) {
    try {
      const paylaod = await request.validateUsing(updatePostValidator)
      const updatedPost = await post_service.editPost(paylaod.postId, paylaod.content)
      return response.status(200).send(updatedPost)
    } catch (err) {
      return response.status(500).send(err.messages)
    }
  }
  async getUserPost({ auth, response }: HttpContext) {
    try {
      const user = await auth.use('web').authenticate()
      const posts = await Post.query().withScopes((scopes) => scopes.getUserPost(user))
      return response.status(200).send(posts)
    } catch (err) {
      return response.status(404).send(err.message)
    }
  }
}
