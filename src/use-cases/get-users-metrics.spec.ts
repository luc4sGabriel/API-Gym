import { expect, describe, it, beforeEach } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { GetUserMetricsUseCase } from './get-users-metrics';

let CheckInsRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsUseCase

describe('Get User Metrics Use Case', () => {

    beforeEach(async () => {
        CheckInsRepository = new InMemoryCheckInsRepository();
        sut = new GetUserMetricsUseCase(CheckInsRepository)
    })

    it('should be able to get check-ins count from metrics', async () => {
        await CheckInsRepository.create({
            userId: 'user-01',
            gymId: 'gym-01',
        })

        await CheckInsRepository.create({
            userId: 'user-01',
            gymId: 'gym-02',
        })

        const { checkInsCount } = await sut.execute({
            userId: 'user-01',
        })

        expect(checkInsCount).toEqual(2);
    })
})