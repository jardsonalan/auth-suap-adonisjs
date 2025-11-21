import axios from 'axios'

export class SuapService {
  private static baseUrl: string = 'https://suap.ifrn.edu.br/api'

  async login(username: string, password: string) {
    const response = await axios.post(`${SuapService.baseUrl}/token/pair`, {
      username,
      password,
    })
    return response.data.access
  }

  async getData(token: string) {
    const response = await axios.get(`${SuapService.baseUrl}/eu/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response.data
  }

  static async verifyToken(token: string) {
    try {
      const response = await axios.post(`${SuapService.baseUrl}/token/verify`, {
        token,
      })
      return response.status === 200
    } catch {
      return false
    }
  }
}
