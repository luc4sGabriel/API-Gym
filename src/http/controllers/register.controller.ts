import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { registerService } from '@/use-cases/register'

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
    await registerService({
        name,
        email,
        password,
    })
  } catch (error: any) {
    reply.status(409).send({
        message: error.message,
    })
  }

  reply.status(201).send()
}
