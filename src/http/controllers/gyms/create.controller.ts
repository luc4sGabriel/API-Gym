import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case'

export async function createGymsController(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    const createGymBodySchema = z.object({
        title: z.string().min(1),
        description: z.string().nullable(),
        phone: z.string().nullable(),
        latitude: z.number().refine(value => {
            return Math.abs(value) <= 90
        }),
        longitude: z.number().refine(value => {
            return Math.abs(value) <= 180
        }),
    })

    const { title, description, phone, longitude, latitude } = createGymBodySchema.parse(request.body)

    const registerUseCase = makeCreateGymUseCase()

    await registerUseCase.execute({
        title,
        description,
        phone,
        latitude,
        longitude
    })

    reply.status(201).send()
}
