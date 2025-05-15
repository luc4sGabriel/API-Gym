import { Prisma, User } from "@prisma/client"

export interface UsersRepository {
    create(data: Prisma.UserCreateInput): Promise<User | null>
    findByEmail(email: string): Promise<User | null>
    findById(id: string): Promise<User | null>
}