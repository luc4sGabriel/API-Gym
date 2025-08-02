import { expect, describe, it, beforeEach } from 'vitest';
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';

let GymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {

    beforeEach(async () => {
        GymsRepository = new InMemoryGymsRepository();
        sut = new FetchNearbyGymsUseCase(GymsRepository)
    })

    it('should be able to fetch nearby gyms', async () => {
        await GymsRepository.create({
            title: 'Near Gym',
            description: 'A gym for JavaScript enthusiasts',
            phone: '123456789',
            latitude: -23.5505,
            longitude: -46.6333,
        })

        await GymsRepository.create({
            title: 'Far Gym',
            description: 'A gym for TypeScript enthusiasts',
            phone: '987654321',
            latitude: -8.005314,
            longitude: -36.056382
        })

        const { gyms } = await sut.execute({
            userLatitude: -23.5505,
            userLongitude:  -46.6333,
        })

        expect(gyms).toHaveLength(1);
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'Near Gym' }),
        ])
    })
})