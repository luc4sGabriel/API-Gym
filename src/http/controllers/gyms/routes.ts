import { FastifyInstance } from 'fastify'
import { searchGymsController } from './search.controller'
import { createGymsController } from './create.controller'
import { nearbyGymsController } from './nearby.controller'
import { authMiddleware } from '@/http/middlewares/auth-middleware'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authMiddleware)

  app.get('/gyms/nearby', nearbyGymsController)
  app.get('/gyms/search', searchGymsController)
  app.post('/gyms/new',{ onRequest: [verifyUserRole('ADMIN')] }, createGymsController)
}
