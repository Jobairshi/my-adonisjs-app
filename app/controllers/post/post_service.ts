import post_query from './post_query.js'

class PostService {
  public async insertPost(userId: number, content: string) {
    return await post_query.insertPost(userId, content)
  }
  public async insertComment(userId: number, postId: number, content: string) {
    return await post_query.insertComment(userId, postId, content)
  }
  public async insertReply(userId: number, commentId: number, postId: number, content: string) {
    return await post_query.insertReply(userId, commentId, postId, content)
  }
  public async getAllPost() {
    const posts = await post_query.getAllPost()
    // console.log(posts)
    return posts
  }
  public async getPostByLimit(limit: number, page: number) {
    return await post_query.getPostByLimit(limit, page)
  }
  public async getCommentByPostId(postId: number) {
    return await post_query.getCommentByPostId(postId)
  }
  public async toggleReaction(userId: number, postId: number, reactionType: number) {
    return await post_query.toggleReaction(userId, postId, reactionType)
  }
  public async deletePost(postId: number) {
    return await post_query.deletePost(postId)
  }
  public async editPost(postId: number, content: string) {
    return await post_query.editPost(postId, content)
  }
}
export default new PostService()
