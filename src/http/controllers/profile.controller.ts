import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-user-profile-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'

export async function profileController(
  request: FastifyRequest,
  reply: FastifyReply,
) {

  try {
    const getProfileUseCase = makeGetUserProfileUseCase()

    await request.jwtVerify()

    const data = await getProfileUseCase.execute({
        userId: request.user.sub
    })
    
    reply.status(200).send({
      user: {
        name: data.user.name,
        email: data.user.email,
      },
    })
  } catch (error) {
    if (error instanceof InvalidCredentialsError){
      reply.status(400).send({ message: error.message })
    }

    throw error
  }
}
