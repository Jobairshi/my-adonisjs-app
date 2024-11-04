import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Comment from './comment.js'
export default class Reply extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare commentId: number

  @column()
  declare content: string

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Comment, {
    foreignKey: 'post_id',
  })
  declare comment: BelongsTo<typeof Comment>
}
