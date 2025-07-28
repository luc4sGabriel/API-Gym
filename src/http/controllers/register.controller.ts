import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case'

export async function registerController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = userSchema.parse(request.body)

  try {

    const registerUseCase = makeRegisterUseCase()

    await registerUseCase.execute({
        name,
        email,
        password,
    })
  } catch (error: any) {
    if (error instanceof UserAlreadyExistsError){
      reply.status(409).send({ message: error.message })
    }

    throw error

  }

  reply.status(201).send()
}
