import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ResetPasswordValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    token: schema.string(),
    password: schema.string([rules.minLength(8)]),
    "confirm_password": schema.string([rules.confirmed('password')]),
  })

  public messages: CustomMessages = {}
}
