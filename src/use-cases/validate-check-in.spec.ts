import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest';
import { ValidateCheckinUseCase } from './validate-check-in';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { LateCheckInValidationError } from './errors/late-check-in-validation-error';

let CheckInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckinUseCase

describe('Validate Check-In Use Case', () => {

    beforeEach(async () => {
        CheckInsRepository = new InMemoryCheckInsRepository();
        sut = new ValidateCheckinUseCase(CheckInsRepository)

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should be able to validate the check-in', async () => {
        const createdCheckIn = await CheckInsRepository.create({
            userId: 'user-01',
            gymId: 'gym-01',
        });

        const { checkIn } = await sut.execute({
            checkInId: createdCheckIn.id,
        })

        expect(checkIn.validated_at).toEqual(expect.any(Date))
        expect(CheckInsRepository.items[0].validated_at).toEqual(expect.any(Date))
    })

    it.skip('should not be able to validate an inexistent check-in', async () => {
        await expect(() => {
            sut.execute({
                checkInId: 'inexistent-check-in-id',
            })
        }).rejects.toBeInstanceOf(ResourceNotFoundError);
    })

    it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
        vi.setSystemTime(new Date(2023, 0, 1, 13, 40)) // UTC-3

        const createdCheckIn = await CheckInsRepository.create({
            userId: 'user-01',
            gymId: 'gym-01',
        });

        const twentyOneMinutesInMs = 1000 * 60 * 21;

        vi.advanceTimersByTime(twentyOneMinutesInMs)

        await expect(() => 
            sut.execute({
                checkInId: createdCheckIn.id,
            })).rejects.toBeInstanceOf(LateCheckInValidationError);
    })
})