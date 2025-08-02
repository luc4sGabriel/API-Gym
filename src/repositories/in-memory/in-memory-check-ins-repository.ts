import { CheckIn, Prisma } from "@prisma/client";
import { CheckInsRepository } from "../check-ins-repository";
import { randomUUID } from "node:crypto";
import dayjs from "dayjs";

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = [];

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
        id: randomUUID(),
        userId: data.userId,
        gymId: data.gymId,
        validated_at: data.validated_at ? new Date(data.validated_at) : null,
        created_at: new Date(),
        }

    this.items.push(checkIn);

    return checkIn
  }

  async countByUserId(userId: string){
    const count = this.items.filter((item) => item.userId === userId).length;

    return count;
  }

  async findByUserIdOnDate(userId: string, date: Date) {

    const startOfDay = dayjs(date).startOf("date");
    const endOfDay = dayjs(date).endOf("date");

    const checkInOnSameDate = this.items.find(
      (checkIn) => {
        const checkInDate = dayjs(checkIn.created_at)
        const isOnSameDate = 
          checkInDate.isAfter(startOfDay) && checkInDate.isBefore(endOfDay);

        return checkIn.userId === userId && isOnSameDate;
    })

    if (!checkInOnSameDate) {
      return null;
    }

    return checkInOnSameDate;
  }

  async findManyByUserId(userId: string, page: number) {
    return this.items
      .filter((item) => item.userId === userId)
      .slice((page - 1) * 20, page * 20);
  }

  async findById(id: string) {
    const checkIn = this.items.find((item) => item.id === id)

    if (!checkIn) {
      return null
    }

    return structuredClone(checkIn)
  
    /**
     * ou então usando spread
     * @example
     *  return { ...checkIn }
     */
  }

  async save(checkIn: CheckIn){
    const checkInIndex = this.items.findIndex((item) => item.id === checkIn.id);

    if (checkInIndex >= 0) {
      this.items[checkInIndex] = checkIn;
    }
    
    return checkIn;
  };
}   
