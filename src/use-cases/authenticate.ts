import { UsersRepository } from "@/repositories/users-repository";
import { compare } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { User } from "@prisma/client";

export interface AuthenticateUseCaseRequest {
    email: string;
    password: string;
}

export interface AuthenticateUseCaseResponse {
    user: User
}

export class AuthenticateUseCase {
    constructor(
        private userRepository: UsersRepository
    ) {}

    async execute( {email, password}: AuthenticateUseCaseRequest ): Promise<AuthenticateUseCaseResponse> {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new InvalidCredentialsError()
        }

        const doesPasswordMatches = await compare(password, user.password_hash)

        if (!doesPasswordMatches) {
            throw new InvalidCredentialsError()
        }

        return { 
            user,
        }
    }
}