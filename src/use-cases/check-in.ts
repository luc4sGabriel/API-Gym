import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { DuplicateCheckInSameDayError } from "./errors/duplicate-checkin-same-day-error";
import { GymsRepository } from "@/repositories/gyms-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";

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
    ) { }

    async execute({
        userId,
        gymId,
        userLatitude,
        userLongitude
    }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
        const gym = await this.gymsRepository.findById(gymId);

        if (!gym) {
            throw new ResourceNotFoundError();
        }

        const distance = getDistanceBetweenCoordinates(
            { latitude: userLatitude, longitude: userLongitude },
            { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() }
        )

        const MAX_DISTANCE_IN_KILOMETERS = 0.1; // 0.1 = 100 meters

        if(distance > MAX_DISTANCE_IN_KILOMETERS) {
            throw new ResourceNotFoundError();
        }

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