import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import { rules, schema, validator } from '@adonisjs/validator'
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
export const registerValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(3).maxLength(255),
    email: vine
      .string()
      .email()
      .maxLength(255)
      .unique(async (db, value, field) => {
        const user = await db
          .from('users')
          .whereNot('id', field.meta.userId)
          .where('email', value)
          .first()
        return !user
      }),
    // email:schema.string([
    //   rules
    // ])
    password: vine.string().minLength(8).maxLength(255),
  })
)
export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().maxLength(255),
    password: vine.string().trim().minLength(8).maxLength(255),
  })
)
