import { UsersRepository } from "@/repositories/users-repository"
import { hash } from "bcryptjs"
import { UserAlreadyExistsError } from "./errors/user-already-exists-error"
import { User } from "@prisma/client"

interface RegisterService {
    password: string
    email: string
    name: string
}

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
}: RegisterService): Promise<RegisterUseCaseResponse> {
    const password_hash = await hash(password, 6)

  const userAlreadyExists = await this.usersRepository.findByEmail(email)

  if (userAlreadyExists) {
    throw new UserAlreadyExistsError()
  }

  const user = await this.usersRepository.create({
    name,
    email,
    password_hash,
  })

  return { 
    user,
  }
}
}