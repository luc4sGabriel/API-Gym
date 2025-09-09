import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeValidateCheckInsUseCase } from '@/use-cases/factories/make-validate-check-in-use-case'

export async function validateCheckInsController(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    const validateCheckInParamsSchema = z.object({
        checkInId: z.string().uuid(),
    })

    const { checkInId } = validateCheckInParamsSchema.parse(request.params)

    const validateUseCase = makeValidateCheckInsUseCase()

    await validateUseCase.execute({
        checkInId,
    })

    reply.status(204).send()
}
