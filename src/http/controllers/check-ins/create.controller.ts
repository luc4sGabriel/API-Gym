import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeCheckInUseCase } from '@/use-cases/factories/make-checkin-use-case'

export async function createCheckInsController(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    const createCheckInParamsSchema = z.object({
        gymId: z.string().uuid(),
    })

    const createCheckInBodySchema = z.object({
        latitude: z.number().refine(value => {
            return Math.abs(value) <= 90
        }),
        longitude: z.number().refine(value => {
            return Math.abs(value) <= 180
        }),
    })

    const gymId = createCheckInParamsSchema.parse(request.params)
    const { latitude, longitude } = createCheckInBodySchema.parse(request.body)

    const registerUseCase = makeCheckInUseCase()

    await registerUseCase.execute({
        userId: request.user.sub,
        gymId: gymId.gymId,
        userLatitude: latitude,
        userLongitude: longitude
    })

    reply.status(201).send()
}
