import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { FastifyInstance } from "fastify";
import request from "supertest";

export async function createAndAuthenticateUserForTests(app: FastifyInstance, isAdmin = false) {
    await prisma.user.create({
        data: {
            role: isAdmin ? 'ADMIN' : 'MEMBER',
            name: 'John Doe 2',
            email: 'johndoe@example.com',
            password_hash: await hash('123456', 6)
        }
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