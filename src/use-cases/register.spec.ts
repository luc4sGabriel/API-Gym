import { expect, describe, it, beforeEach } from 'vitest';
import { RegisterUseCase } from './register';
import { compare } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

// const UsersRepository = new InMemoryUsersRepository();
//         const registerUseCase = new RegisterUseCase(UsersRepository)

let UsersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {

    beforeEach(() => {
        UsersRepository = new InMemoryUsersRepository();
        sut = new RegisterUseCase(UsersRepository)
    })

    it('should be able to register an user', async() => { 
       const { user } = await sut.execute({
            name: 'John Doe',
            email: 'doe@gmail.com',
            password: '12312313'
       })

    expect(user.id).toEqual(expect.any(String))
    })

    it('should hash user password upon registration', async() => {
       const { user } = await sut.execute({
            name: 'John Doe',
            email: 'doe@gmail.com',
            password: '12312313'
       })

       console.log(user.password_hash);

       const isPasswordCorrectlyHashed = await compare('12312313', user.password_hash)
       
        expect(isPasswordCorrectlyHashed).toBe(true)
    })

    it('should not be able to register with same email twice', async() => {
        const email = 'doe@gmail.com'

       await sut.execute({
            name: 'John Doe',
            email,
            password: '12312313'
       })
       
        await expect(() => 
            sut.execute({
            name: 'John Doe',
            email,
            password: '12312313'
            })
        ).rejects.instanceOf(UserAlreadyExistsError)
    })
})