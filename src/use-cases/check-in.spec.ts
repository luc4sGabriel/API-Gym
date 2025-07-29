import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest';
import { CheckinUseCase } from './check-in';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error';
import { MaxDistanceError } from './errors/max-distance-error';

let CheckInsRepository: InMemoryCheckInsRepository
let GymsRepository: InMemoryGymsRepository
let sut: CheckinUseCase

describe('Check-In Use Case', () => {

    beforeEach(async () => {
        CheckInsRepository = new InMemoryCheckInsRepository();
        GymsRepository = new InMemoryGymsRepository();
        sut = new CheckinUseCase(CheckInsRepository, GymsRepository)

        await GymsRepository.create({
            id: 'gym-01',
            title: 'Gym 01',
            description: "",
            phone: "",
            latitude: -8.292156,
            longitude: -35.978563,
        })

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should be able to check in', async () => {
        const { checkIn } = await sut.execute({
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: -8.292156,
            userLongitude: -35.978563,
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to check in twice in the same day', async () => {
        vi.setSystemTime(new Date(2025, 0, 1, 12, 0, 0))

        await sut.execute({
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: -8.292156,
            userLongitude: -35.978563,
        })

        await expect(() =>
            sut.execute({
                userId: 'user-01',
                gymId: 'gym-01',
            userLatitude: -8.292156,
            userLongitude: -35.978563,
            })
        ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
    })

    it('should be able to check in twice in different days', async () => {
        vi.setSystemTime(new Date(2025, 0, 1, 12, 0, 0))

        await sut.execute({
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: -8.292156,
            userLongitude: -35.978563,
        })

        vi.setSystemTime(new Date(2025, 0, 2, 12, 0, 0))

        const { checkIn } = await sut.execute({
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: -8.292156,
            userLongitude: -35.978563,
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to check in on distant gym', async () => {
        GymsRepository.items.push({
            id: 'gym-02',
            title: 'Gym 02',
            description: "",
            phone: "",
            latitude: new Decimal(-8.292156),
            longitude: new Decimal(-35.978563),
        })

        // -8.292156, -35.978563
        await expect(() => sut.execute({
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: 0,
            userLongitude: 0,
        })).rejects.toBeInstanceOf(MaxDistanceError)
    })
})