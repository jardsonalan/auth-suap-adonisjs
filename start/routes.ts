/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const AuthController = () => import('#controllers/auth_controller')

router.get('/', async () => {
  return {
    hello: 'Funcionando',
  }
})

router.post('/login', [AuthController, 'login'])
router.get('/data', [AuthController, 'getData'])
router.get('/logout', [AuthController, 'logout'])
