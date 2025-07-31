import { expect, describe, it, beforeEach } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { CreateGymUseCase } from './create-gym';

let GymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {

    beforeEach(() => {
        GymsRepository = new InMemoryGymsRepository();
        sut = new CreateGymUseCase(GymsRepository)
    })

    it.skip('should be able to create an gym', async() => { 
       const { gym } = await sut.execute({
            title: 'Gym A',
            description: 'A great gym',
            phone: '123456789',
            latitude: -23.5505,
            longitude: -46.6333
       })

    expect(gym.id).toEqual(expect.any(String))
    })
})