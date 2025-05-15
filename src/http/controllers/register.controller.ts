import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { RegisterUseCase } from '@/use-cases/register'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma.users.repository'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'

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

    const prismaUsersRepository = new PrismaUsersRepository()
    const registerUseCase = new RegisterUseCase(prismaUsersRepository)

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
