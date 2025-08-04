import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error";
import { FastifyReply, FastifyRequest } from "fastify";

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply){
    try {
        await request.jwtVerify();
    } catch(e) {
        reply.status(401).send({ message: "Unauthorized" })
    }
}