import { FastifyInstance } from 'fastify'

import { authenticateController } from '../users/authenticate.controller'
import { createCheckInsController } from './create.controller'
import { validateCheckInsController } from './validate.controller'
import { historyCheckInsController } from './history.controller'
import { metricsController } from './metrics.controller'
import { authMiddleware } from '@/http/middlewares/auth-middleware'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authMiddleware)

  app.post('/gyms/:gymId/check-ins', createCheckInsController)
  app.patch('/check-ins/:checkInId/validate', { onRequest: [verifyUserRole ('ADMIN')] },validateCheckInsController)

  app.get('/check-ins/history', historyCheckInsController)
  app.get('/check-ins/metrics', metricsController)
}
