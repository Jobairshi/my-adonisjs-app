import { DateTime } from 'luxon'

import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Post from './post.js'
import Reaction from './reaction.js'
import Reply from './reply.js'

export default class Comment extends BaseModel {
  public serializeExtras = true
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: number

  @column()
  declare post_id?: number

  @column()
  declare content?: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => User, { foreignKey: 'user_id', localKey: 'id' })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Post)
  declare post: BelongsTo<typeof Post>

  @hasMany(() => Reaction)
  declare reactions: HasMany<typeof Reaction>
  @hasMany(() => Reply)
  declare replies: HasMany<typeof Reply>
}
