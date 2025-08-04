import { FastifyInstance } from 'fastify'
import { registerController } from './controllers/register.controller'
import { authenticateController } from './controllers/authenticate.controller'
import { profileController } from './controllers/profile.controller'
import { authMiddleware } from './middlewares/auth-middleware'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', registerController)
  app.post('/sessions', authenticateController)


  app.get('/profile', { onRequest: [authMiddleware] }, profileController)
}
