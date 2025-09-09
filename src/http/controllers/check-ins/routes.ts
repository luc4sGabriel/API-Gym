import { FastifyInstance } from 'fastify'

import { authenticateController } from '../users/authenticate.controller'
import { createCheckInsController } from './create.controller'
import { validateCheckInsController } from './validate.controller'
import { historyCheckInsController } from './history.controller'
import { metricsController } from './metrics.controller'

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authenticateController)

  app.get('/check-ins/history', historyCheckInsController)
  app.get('/check-ins/metrics', metricsController)

  app.post('/gyms/:gymId/check-ins', createCheckInsController)
  app.patch('/check-ins/:checkInId/validate', validateCheckInsController)
}
