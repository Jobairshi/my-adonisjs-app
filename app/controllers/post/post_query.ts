import Comment from '#models/comment'
import Post from '#models/post'
import Reaction from '#models/reaction'
import Reply from '#models/reply'

class PostQuery {
  public async insertPost(userId: number, content: string) {
    if (userId && content) {
      return await Post.create({ user_id: userId, content: content })
    }
    return 'Cannot insert post'
  }
  public async insertComment(userId: number, postId: number, content: string) {
    if (userId && postId && content) {
      return await Comment.create({ user_id: userId, post_id: postId, content: content })
    }
    return 'Cannot insert comment'
  }
  public async insertReply(userId: number, commentId: number, postId: number, content: string) {
    if (userId && commentId && postId && content) {
      return await Reply.create({
        userId: userId,
        postId: postId,
        commentId: commentId,
        content: content,
      })
    }
    return 'Cannot insert reply'
  }
  public async getAllPost() {
    const posts = await Post.query()
      .preload('comments', (qu) => {
        qu.preload('replies')
      })
      .preload('reactions')
      .preload('user')
      .orderBy('id', 'desc')
    // console.log(posts)
    return posts
  }
  public async getPostByLimit(limit: number, page: number) {
    return await Post.query()
      .preload('comments', (qu) => {
        qu.preload('replies')
      })
      .preload('reactions')
      .preload('user')
      .orderBy('id', 'desc')
      .paginate(page, limit)
  }
  public async getCommentByPostId(postId: number) {
    return await Comment.query().where('post_id', postId)
  }
  public async toggleReaction(userId: number, postId: number, reactionType: number) {
    const reaction = await Reaction.query()
      .where('user_id', userId)
      .where('post_id', postId)
      .first()
    if (reaction) {
      await reaction.delete()
      return { message: 'Reaction removed' }
    }
    return await Reaction.create({ userId: userId, postId: postId, type: reactionType })
  }
  public async deletePost(postId: number) {
    const del = await Post.query().where('id', postId).delete()
    console.log(del)
    if (del[0]) {
      return 'Post deleted successfully'
    }
    return 'Post not found'
  }
  public async editPost(postId: number, content: string) {
    const post = await Post.findOrFail(postId)
    post.content = content
    await post.save()
    return post
  }
}

export default new PostQuery()
