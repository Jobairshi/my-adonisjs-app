import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany, scope } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'

import Comment from './comment.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Reaction from './reaction.js'
import Reply from './reply.js'

export default class Post extends BaseModel {
  public serializeExtras = true

  public static getUserPost = scope((query, user: User) => {
    // console.log('we are in post model', user.id)
    query.where('user_id', '=', user.id)
  })

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: number

  @column()
  declare content: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'user_id',
    localKey: 'id',
  })
  declare user: BelongsTo<typeof User>
  @hasMany(() => Comment, {
    foreignKey: 'post_id',
    localKey: 'id',
  })
  declare comments: HasMany<typeof Comment>
  @hasMany(() => Reaction)
  declare reactions: HasMany<typeof Reaction>
  @hasMany(() => Reply)
  declare replies: HasMany<typeof Reply>
}
