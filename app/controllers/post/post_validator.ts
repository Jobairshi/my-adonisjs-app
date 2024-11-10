import vine, { SimpleMessagesProvider } from '@vinejs/vine'

vine.messagesProvider = new SimpleMessagesProvider({
  'required': 'The {{ field }} field is required',
  'string': 'The value of {{ field }} field must be a string',
  'email': 'The value is not a valid email address',
  'minLength': 'The {{ field }} field must be {{ min }} characters long',
  'maxLength': 'The {{ field }} field must be 5 between {{ max }} characters',
  'username.required': 'Please choose a username for your account',
  'content.required': 'Please choose a content for your account',
  'id.required': 'Id is required',
})
export const insertPostValidator = vine.compile(
  vine.object({
    content: vine.string().trim().minLength(5).maxLength(255),
  })
)
export const insertCommentValidator = vine.compile(
  vine.object({
    postId: vine.number(),
    content: vine.string().trim().minLength(5).maxLength(255),
  })
)
export const insertReplyValidator = vine.compile(
  vine.object({
    postId: vine.number(),
    commentId: vine.number(),
    content: vine.string().trim().minLength(5).maxLength(255),
  })
)
export const deletePostValidator = vine.compile(
  vine.object({
    postId: vine.number(),
  })
)
vine
export const updatePostValidator = vine.compile(
  vine.object({
    postId: vine.number(),
    content: vine.string().trim().minLength(5).maxLength(255),
  })
)

export const addReactionValidator = vine.compile(
  vine.object({
    postId: vine.number(),
    reactionType: vine.number(),
  })
)
