import { Gym, Prisma } from "@prisma/client";
import { GymsRepository } from "../gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { randomUUID } from "crypto";

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = [];

  async findById(id: string) {
    const gym = this.items.find(gym => gym.id === id);

    if (!gym) {
      return null;
    }

    return gym;
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title ,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Decimal(data.latitude.toString()),
      longitude: new Decimal(data.longitude.toString()),
      created_at: new Date(),
    }

    this.items.push(gym);

    return gym
  }

  async searchMany(query: string, page: number) {
    return this.items
    .filter(gym => gym.title.includes(query))
    .slice((page - 1) * 20, page * 20);
  }
}   
