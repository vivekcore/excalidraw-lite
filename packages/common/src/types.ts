import {z} from "zod"

export const CreateUserSchema = z.object({
    password: z.string(),
    name: z.string().min(3).max(20),
    email: z.email()
})

export const SignSchema =  z.object({
    email: z.email(),
    password: z.string(),
})

export const CreateRoomSchema = z.object({
    name: z.string().default("Untitled").optional,
})