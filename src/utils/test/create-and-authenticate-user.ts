import { FastifyInstance } from "fastify";
import request from "supertest";

export async function createAndAuthenticateUserForTests(app: FastifyInstance) {
    await request(app.server)
        .post('/users')
        .send({
            name: 'John Doe 2',
            email: 'johndoe@example.com',
            password: '123456'
        })

    const authResponse = await request(app.server)
        .post('/sessions')
        .send({
            email: 'johndoe@example.com',
            password: '123456'
        })

    const { token } = authResponse.body

    return { 
        token,
    }
}