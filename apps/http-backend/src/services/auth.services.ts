import { userSignin, userSignup } from "@repo/common/types";
import { prisma } from "@repo/db";
import { ValidationError, ConflictError, UnauthorizedError } from "@repo/db/error";
import Jwt from "jsonwebtoken";
import { JWT_SECRET, SALT_ROUNDS } from "../config.js";
import bcrypt from "bcrypt"
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
    const hashed = await bcrypt.hash(password,SALT_ROUNDS)
    const response = await prisma.user.create({
      data: {
        name,
        email,
        password:hashed
      },
    });
    const payload = { userId: response.id };
    const token = Jwt.sign(payload, JWT_SECRET);
    return {
      user:response,
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
      },
    });
    if (!response) {
      throw new UnauthorizedError("Invalid email");
    }
    const match = await bcrypt.compare(password, response.password);
    if(!match){
      throw new UnauthorizedError("wrong password");
    }
    const payload = { userId: response.id };
    const token = Jwt.sign(payload, JWT_SECRET);

    return {
      user:response,
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
      user: response
    };
  }

}

export const userServices = new UserServices();
