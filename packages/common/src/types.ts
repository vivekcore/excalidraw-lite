import {z} from "zod"

export const userSignup = z.object({
    password: z.string(),
    name: z.string().min(3).max(20),
    email: z.email()
})

export const userSignin =  z.object({
    email: z.email(),
    password: z.string(),
})
export const userUpdata = z.object({
    name: z.string().min(3).max(20).optional,
    email: z.email().optional,
    password: z.string().optional
})
export const CreateRoomSchema = z.object({
    name: z.string().default("Untitled").optional,
})