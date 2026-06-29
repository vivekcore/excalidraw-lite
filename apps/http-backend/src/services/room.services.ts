import { prisma } from "@repo/db";
import { z } from "zod";
import { GenerateSlug } from "../utils/slug.js";
class RoomServices {
  async createRoom(userId: string, name: string) {
    const zodSchema = z.object({
      Name: z.string().max(20).min(1),
    });
    const parse = zodSchema.safeParse({ Name: name });
    if (!parse.success) {
      return;
    }
    const slug = GenerateSlug();
    const { Name } = parse.data;
    const data = await prisma.room.create({
      data: {
        name: Name,
        slug: (await slug).toString(),
        adminId: userId,
      },
    });
    return {
      room: {
        userId,
        roomId: data.id,
        slug: data.slug,
        name: data.name,
      },
    };
  }
  async updateRoom(userId: string, name: string, roomId: number) {
    const zodSchema = z.object({
      Name: z.string().max(20).min(1),
    });
    const parse = zodSchema.safeParse({ Name: name });
    if (!parse.success) {
      return;
    }
    const { Name } = parse.data;
    const data = await prisma.room.update({
      where: {
        adminId: userId,
        id: roomId,
      },
      data: {
        name: Name,
      },
    });

    return {
      room: {
        userId,
        roomId: data.id,
        slug: data.slug,
        name: data.name,
      },
    };
  }
  async deleteRoom(userId: string, roomId: number) {
    const data = await prisma.room.delete({
      where: {
        id: roomId,
        adminId: userId,
      },
    });
    if (!data) {
      return;
    }
    return {
      room: {
        userId,
        roomId: data.id,
        slug: data.slug,
        name: data.name,
      },
    };
  }
}

export const roomServices = new RoomServices();
