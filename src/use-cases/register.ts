import { UsersRepository } from "@/repositories/users-repository"
import { hash } from "bcryptjs"
import { UserAlreadyExistsError } from "./errors/user-already-exists-error"

interface RegisterService {
    password: string
    email: string
    name: string
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
}: RegisterService) {
    const password_hash = await hash(password, 6)

  const userAlreadyExists = await this.usersRepository.findByEmail(email)

  if (userAlreadyExists) {
    throw new UserAlreadyExistsError()
  }

  await this.usersRepository.create({
    name,
    email,
    password_hash,
  })
}
}