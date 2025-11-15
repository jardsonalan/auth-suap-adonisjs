import type { HttpContext } from '@adonisjs/core/http'
import { SuapService } from '#services/suap_service'

export default class AuthController {
  async login({ request, response }: HttpContext) {
    const { username, password } = request.only(['username', 'password'])

    const suap = new SuapService()

    try {
      const token = await suap.login(username, password)

      response.cookie('suap_token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: '1h',
        path: '/',
      })

      return response.ok({
        message: 'Login realizado com sucesso',
      })
    } catch {
      return response.badRequest({ message: 'Credenciais inválidas' })
    }
  }

  async getData({ request, response }: HttpContext) {
    let token = request.cookie('suap_token')

    if (!token) {
      return response.unauthorized({ message: 'Não autenticado' })
    }

    const suap = new SuapService()
    const data = await suap.getData(token)

    return response.ok(data)
  }
}
