import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeSearchGymsUseCase } from '@/use-cases/factories/make-search-gyms-use-case'

export async function searchGymsController(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    const searchGymQuerySchema = z.object({
        query: z.string(),
        page: z.coerce.number().min(1).default(1),
    })

    const { query, page } = searchGymQuerySchema.parse(request.query)

    const searchUseCase = makeSearchGymsUseCase()

    const { gyms } = await searchUseCase.execute({
        query,
        page
    })

    reply.status(200).send({
        gyms,
    })
}
