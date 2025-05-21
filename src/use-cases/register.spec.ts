import { expect, describe, it } from 'vitest';
import { RegisterUseCase } from './register';
import { compare } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';


describe('Register Use Case', () => {
    it('should be able to register an user', async() => {
        const UsersRepository = new InMemoryUsersRepository();
        const registerUseCase = new RegisterUseCase(UsersRepository)

       const { user } = await registerUseCase.execute({
            name: 'John Doe',
            email: 'doe@gmail.com',
            password: '12312313'
       })

    expect(user.id).toEqual(expect.any(String))

       
    })

    it('should hash user password upon registration', async() => {
        const UsersRepository = new InMemoryUsersRepository();
        const registerUseCase = new RegisterUseCase(UsersRepository)

       const { user } = await registerUseCase.execute({
            name: 'John Doe',
            email: 'doe@gmail.com',
            password: '12312313'
       })

       console.log(user.password_hash);

       const isPasswordCorrectlyHashed = await compare('12312313', user.password_hash)
       
        expect(isPasswordCorrectlyHashed).toBe(true)
    })

    it('should not be able to register with same email twice', async() => {
        const UsersRepository = new InMemoryUsersRepository();
        const registerUseCase = new RegisterUseCase(UsersRepository)

        const email = 'doe@gmail.com'

       await registerUseCase.execute({
            name: 'John Doe',
            email,
            password: '12312313'
       })
       
        await expect(() => 
            registerUseCase.execute({
            name: 'John Doe',
            email,
            password: '12312313'
            })
        ).rejects.instanceOf(UserAlreadyExistsError)
    })
})