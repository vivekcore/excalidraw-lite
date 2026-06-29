import { userSignin, userSignup, userUpdata } from "@repo/common/types";
import { prisma } from "@repo/db";
import { Prisma } from "../../../../packages/db/dist/generated/prisma/client.js";
import Jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { response } from "express";

type createUser = Prisma.UserCreateInput;
class UserServices {
  async SignupUser(data: any) {
    const parse = userSignup.safeParse(data);
    if (!parse.success) {
      return;
    }
    const { name, email, password } = parse.data;
    const existingU = prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (existingU !== null) {
      return;
    }
    const response = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });
    const payload = { userId: response.id };
    const token = Jwt.sign(payload, JWT_SECRET);
    return {
      user: {
        id: response.id,
        name: response.name,
        email: response.email,
        image: response.image,
        createdAt: response.createdAt,
      },
      token,
    };
  }

  async LoginUser(data: any) {
    const parse = userSignin.safeParse(data);
    if (!parse.success) {
      return;
    }
    const { email, password } = parse.data;
    const response = await prisma.user.findFirst({
      where: {
        email,
        password,
      },
    });
    if (!response) {
      return;
    }
    const payload = { userId: response.id };
    const token = Jwt.sign(payload, JWT_SECRET);

    return {
      user: {
        id: response.id,
        name: response.name,
        email: response.email,
        image: response.image,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
      },
      token,
    };
  }
  // async UpdateUser(data: any, userId: string) {
  //   const parse = userUpdata.safeParse(data);
  //   if (!parse.success) {
  //     return;
  //   }
  //   let userD;
  //   if (parse.data.email || parse.data.password || parse.data.name) {
  //     userD = parse.data;
  //   }
  //   if (!userD) {
  //     return;
  //   }
  //   //need to fix
  // //   const resposne = await prisma.user.update({
  // //     where: { id: userId },
  // //     data: {
  // //       ...userD,
  // //     },
  // //   });
  // }

  async DeleteUser(userId: string) {
    const response = await prisma.user.delete({
      where: {
        id: userId,
      },
    });
    return {
      user: {
        id: response.id,
        name: response.name,
        email: response.email,
      },
    };
  }
}

export const userServices = new UserServices();
