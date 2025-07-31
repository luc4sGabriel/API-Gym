import { expect, describe, it, beforeEach } from 'vitest';
import { SearchGymsUseCase } from './search-gyms';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';

let GymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {

    beforeEach(async () => {
        GymsRepository = new InMemoryGymsRepository();
        sut = new SearchGymsUseCase(GymsRepository)
    })

    it('should be able to search for gyms', async () => {
        await GymsRepository.create({
            title: 'JavaScript Gym',
            description: 'A gym for JavaScript enthusiasts',
            phone: '123456789',
            latitude: -23.5505,
            longitude: -46.6333,
        })

        await GymsRepository.create({
            title: 'TypeScript Gym',
            description: 'A gym for TypeScript enthusiasts',
            phone: '987654321',
            latitude: -23.5505,
            longitude: -46.6333,
        })

        const { gyms } = await sut.execute({
            query: 'JavaScript',
            page: 1,
        })

        expect(gyms).toHaveLength(1);
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'JavaScript Gym' }),
        ])
    })

    it.skip('should be able to fetch paginated gyms search', async () => {
        for (let i = 1; i <= 22; i++) {
            await GymsRepository.create({
                title: `JavaScript Gym ${i}`,
                description: 'A gym for JavaScript enthusiasts',
                phone: '123456789',
                latitude: -23.5505,
                longitude: -46.6333,
            })
        }

        const { gyms } = await sut.execute({
            query: 'JavaScript',
            page: 2,
        })

        expect(gyms).toHaveLength(2);
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'JavaScript Gym 21' }),
            expect.objectContaining({ title: 'JavaScript Gym 22' }),
        ])
    })
})