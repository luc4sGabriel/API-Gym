import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case'

export async function createGymsController(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    const createGymBodySchema = z.object({
        title: z.string(),
        description: z.string().nullable(),
        phone: z.string().nullable(),
        latitude: z.coerce.number().refine(value => Math.abs(value) <= 90),
        longitude: z.coerce.number().refine(value => Math.abs(value) <= 180),
    })

    const { title, description, phone, latitude, longitude } = createGymBodySchema.parse(request.body)

    const createUseCase = makeCreateGymUseCase()

    await createUseCase.execute({
        title,
        description,
        phone,
        latitude,
        longitude
    })

    reply.status(201).send()
}
