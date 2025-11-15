import axios from 'axios'

export class SuapService {
  private baseUrl: string = 'https://suap.ifrn.edu.br/api'

  async login(username: string, password: string) {
    const response = await axios.post(`${this.baseUrl}/token/pair`, {
      username,
      password,
    })
    return response.data.access
  }

  async getData(token: string) {
    const response = await axios.get(`${this.baseUrl}/eu/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response.data
  }
}
