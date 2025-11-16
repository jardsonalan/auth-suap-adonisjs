import type { HttpContext } from '@adonisjs/core/http'
import { SuapService } from '#services/suap_service'
import env from '#start/env'

// Matrículas autorizadas para login
const AUTHORIZED_MATRICULAS = env
  .get('AUTHORIZED_MATRICULAS')
  .split(',')
  .map((m: string) => m.trim())

export default class AuthController {
  async login({ request, response }: HttpContext) {
    const { username, password } = request.only(['username', 'password'])

    // Validação do formato do usuário
    const isCpf = username.length === 11 && /^\d+$/.test(username)
    const isMatricula = username.length > 11 && /^\d+$/.test(username)

    // Verifica se é CPF ou matrícula
    if (!isCpf && !isMatricula) {
      return response.badRequest({ message: 'Usuário inválido' })
    }

    // Se for matrícula, verifica se está na lista de autorizadas
    if (isMatricula && !AUTHORIZED_MATRICULAS.includes(username)) {
      return response.badRequest({ message: 'Matrícula não autorizada' })
    }

    const suap = new SuapService() // Instancia o serviço Suap

    try {
      const token = await suap.login(username, password) // Tenta fazer login no Suap

      // Armazena o token em um cookie seguro (Cookie HttpOnly)
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
    let token = request.cookie('suap_token') // Tenta obter o token do cookie

    if (!token) {
      return response.unauthorized({ message: 'Não autenticado' })
    }

    const suap = new SuapService()

    try {
      // Tenta obter os dados do Suap usando o token
      const data = await suap.getData(token)
      return response.ok(data)
    } catch (error) {
      // Se o token estiver expirado, limpa o cookie
      response.clearCookie('suap_token')
      return response.unauthorized({ message: 'Token inválido ou expirado' })
    }
  }

  // Logout do usuário
  async logout({ response }: HttpContext) {
    response.clearCookie('suap_token') // Limpa o cookie do token
    return response.ok({ message: 'Logout realizado com sucesso' })
  }
}
