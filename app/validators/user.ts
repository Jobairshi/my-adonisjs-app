import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(3).maxLength(255),
    email: vine.string().email().maxLength(255),
    password: vine.string().minLength(8).maxLength(255),
  })
)
export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().maxLength(255),
    password: vine.string().trim().minLength(8).maxLength(255),
  })
)
