import fastify from 'fastify'
import fastifyCookie from '@fastify/cookie'
import { ZodError } from 'zod'
import { env } from './env'
import fastifyJwt from '@fastify/jwt'
import { gymsRoutes } from './http/controllers/gyms/routes'
import { checkInsRoutes } from './http/controllers/check-ins/routes'
import { usersRoutes } from './http/controllers/users/routes'

export const app = fastify()

app.register(usersRoutes)
app.register(gymsRoutes)
app.register(checkInsRoutes)

app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    cookie: {
        cookieName: 'refreshToken',
        signed: false,
    },
    sign: {
        expiresIn: '10m',
    }
})

app.register(fastifyCookie)

app.setErrorHandler((error, _, reply) => {
    if (error instanceof ZodError) {
        return reply
            .status(400)
            .send({ message: 'Validation error.', issues: error.format(), error })
    }

    if (env.NODE_ENV !== 'production') {
        console.log(error);
    } else {
        // DataDog/Sentry/NewRelics
    }

    return reply
        .status(500)
        .send({ message: 'Internal Server Error', error: error.message })

})
