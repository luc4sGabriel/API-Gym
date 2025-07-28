import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { DuplicateCheckInSameDayError } from "./errors/duplicate-checkin-same-day-error";
import { GymsRepository } from "@/repositories/gyms-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

export interface CheckInUseCaseRequest {
    userId: string;
    gymId: string;
    userLatitude: number;
    userLongitude: number;
}

export interface CheckInUseCaseResponse {
    checkIn: CheckIn;
}

export class CheckinUseCase {
    constructor(
        private checkInsRepository: CheckInsRepository,
        private gymsRepository: GymsRepository,
    ) {}

    async execute( { 
        userId,
        gymId,
        userLatitude,
        userLongitude
         }: CheckInUseCaseRequest ): Promise<CheckInUseCaseResponse> {
        const gym = await this.gymsRepository.findById(gymId);

        if (!gym) {
            throw new ResourceNotFoundError();
        }

        // calculate distance between user and gym

        const duplicateCheckIn = await this.checkInsRepository.findByUserIdOnDate(userId, new Date())

        if (duplicateCheckIn) {
            throw new DuplicateCheckInSameDayError();
        }

        const checkIn = await this.checkInsRepository.create({
            gymId,
            userId,
        });

        return { 
            checkIn,
        }
    }
}