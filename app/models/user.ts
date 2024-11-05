import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Post from './post.js'
import Comment from './comment.js'
import Reaction from './reaction.js'
import { DbRememberMeTokensProvider } from '@adonisjs/auth/session'
import { AccessToken, DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  public serializeExtras = true
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string
  @hasMany(() => Post, {
    foreignKey: 'user_id',
    localKey: 'id',
  })
  declare posts: HasMany<typeof Post>
  @hasMany(() => Comment)
  declare comments: HasMany<typeof Comment>
  @hasMany(() => Reaction)
  declare reactions: HasMany<typeof Reaction>
  static rememberMeTokens = DbRememberMeTokensProvider.forModel(User)
  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '30 days',
    prefix: 'oat_',
    table: 'auth_access_tokens',
    type: 'auth_token',
    tokenSecretLength: 40,
  })
  currentAccessToken?: AccessToken
}
