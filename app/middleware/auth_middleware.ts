import { SuapService } from '#services/suap_service'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const token = ctx.request.cookie('suap_token')

    if (!token) return ctx.response.unauthorized({ message: 'Não autorizado' })

    const valido = await SuapService.verifyToken(token)

    if (!valido) return ctx.response.unauthorized({ message: 'Token inválido' })

    await next()
  }
}
