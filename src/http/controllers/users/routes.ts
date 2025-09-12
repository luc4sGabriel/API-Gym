import { FastifyInstance } from 'fastify'

import { authenticateController } from './authenticate.controller'

import { registerController } from './register.controller'
import { profileController } from './profile.controller'
import { authMiddleware } from '@/http/middlewares/auth-middleware'
import { refreshController } from './refresh.controller'

export async function usersRoutes(app: FastifyInstance) {
  app.patch('/token/refresh', refreshController)

  app.post('/users', registerController)
  app.post('/sessions', authenticateController)


  app.get('/profile', { onRequest: [authMiddleware] }, profileController)
}
