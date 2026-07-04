import "dotenv/config"
import rateLimit from "express-rate-limit"
export const JWT_SECRET = process.env.JWT_SECRET as string
export const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) 
export const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, 
	limit: 100, 
	standardHeaders: 'draft-8',
	legacyHeaders: false, 
	ipv6Subnet: 56, 
})