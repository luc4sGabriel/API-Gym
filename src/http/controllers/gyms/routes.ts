import { FastifyInstance } from 'fastify'

import { authenticateController } from '../users/authenticate.controller'
import { searchGymsController } from './search.controller'
import { createGymsController } from './create.controller'
import { nearbyGymsController } from './nearby.controller'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authenticateController)

  app.post('/gyms/new', createGymsController)

  app.get('/gyms/nearby', nearbyGymsController)
  app.get('/gyms/search', searchGymsController)
}
