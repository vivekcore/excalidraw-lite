import { prisma } from "@repo/db";
import { z } from "zod";
import { GenerateSlug } from "../utils/slug.js";
import ApiError from "../utils/ApiError.js";
class RoomServices {
  async createRoom(userId: string, name: string) {
    const zodSchema = z.object({
      Name: z.string().max(20).min(1),
    });
    const parse = zodSchema.safeParse({ Name: name });
    if (!parse.success) {
      throw new ApiError(400,"Validation Error")
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
    return data;
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

    return data;
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
    return data;
  }
  async myRooms(useId:string){
    const data = await prisma.room.findMany({
      where:{
        adminId:useId
      }
    })
    
    return data
  }
  async getChatByRoomId(userId: string, roomId: number) {
    const data = await prisma.chat.findFirst({
      where: {
        roomId,
        userId,
      },
    });

    return data;
  }

  async getRoomBySlug(userId: string, slug: string) {
    const data = await prisma.room.findFirst({
      where: {
        slug,
        userId,
      },
    });
    if (!data) {
      console.log("room not found");
      return;
    }
    return data;
  }
}

export const roomServices = new RoomServices();
