/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const AuthController = () => import('#controllers/auth_controller')

router.get('/', async () => {
  return {
    hello: 'Funcionando',
  }
})

router.post('/login', [AuthController, 'login'])

router
  .group(() => {
    router.get('/data', [AuthController, 'getData'])
    router.get('/logado', async () => {
      return {
        logado: 'OK',
      }
    })
    router.get('/logout', [AuthController, 'logout'])
  })
  .use([middleware.auth()])
