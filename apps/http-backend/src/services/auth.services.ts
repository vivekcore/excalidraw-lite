import { userSignin, userSignup } from "@repo/common/types";
import { prisma } from "@repo/db";
import { ValidationError, ConflictError, UnauthorizedError } from "@repo/db/error";
import Jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

class UserServices {
  async SignupUser(data: any) {
    const parse = userSignup.safeParse(data);
    if (!parse.success) {
      throw new ValidationError("Invalid signup data", parse.error);
    }
    const { name, email, password } = parse.data;
    const existingU = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (existingU) {
      throw new ConflictError("User already exists");
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
      throw new ValidationError("Invalid signin data", parse.error);
    }
    const { email, password } = parse.data;
    const response = await prisma.user.findFirst({
      where: {
        email,
        password,
      },
    });
    if (!response) {
      throw new UnauthorizedError("Invalid email or password");
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
