import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest';
import { CheckinUseCase } from './check-in';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { DuplicateCheckInSameDayError } from './errors/duplicate-checkin-same-day-error';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';

let CheckInsRepository: InMemoryCheckInsRepository
let GymsRepository: InMemoryGymsRepository
let sut: CheckinUseCase

describe('Check-In Use Case', () => {

    beforeEach(() => {
        CheckInsRepository = new InMemoryCheckInsRepository();
        GymsRepository = new InMemoryGymsRepository();
        sut = new CheckinUseCase(CheckInsRepository, GymsRepository)

        GymsRepository.items.push({
            id: 'gym-01',
            title: 'Gym 01',
            description: "",
            phone: "",
            latitude: new Decimal(0),
            longitude: new Decimal(0),
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
            userLatitude: 0,
            userLongitude: 0,
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to check in twice in the same day', async () => {
        vi.setSystemTime(new Date(2025, 0, 1, 12, 0, 0))

        await sut.execute({
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: 0,
            userLongitude: 0,
        })

        await expect(() =>
            sut.execute({
                userId: 'user-01',
                gymId: 'gym-01',
                userLatitude: 0,
                userLongitude: 0,
            })
        ).rejects.toBeInstanceOf(DuplicateCheckInSameDayError)
    })

    it('should be able to check in twice in different days', async () => {
        vi.setSystemTime(new Date(2025, 0, 1, 12, 0, 0))

        await sut.execute({
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: 0,
            userLongitude: 0,
        })

        vi.setSystemTime(new Date(2025, 0, 2, 12, 0, 0))

        const { checkIn } = await sut.execute({
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: 0,
            userLongitude: 0,
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
        })).rejects.toBeInstanceOf(Error)
    })
})