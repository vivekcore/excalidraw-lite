# Phase 1 — Backend Security & Housekeeping

## Goal
Fix live security holes and code quality issues in HTTP backend + WS backend before building new features.

## Steps

### 1.1 .env.example files ✅ Done
Created `.env.example` for `apps/http-backend`, `apps/ws-backend`, `packages/db`.  
`.env` files are already gitignored and never committed. **No credential rotation needed.**

### 1.2 Add bcrypt for password hashing

**Files to modify:**
- `apps/http-backend/package.json` — add `bcryptjs` + `@types/bcryptjs` dependency
- `apps/http-backend/src/routes/userRoutes.ts` — hash password on signup, compare on signin

**Changes in userRoutes.ts:**
- Import `bcryptjs`
- `signup`: hash password with `bcrypt.hash(password, 10)` before `prisma.user.create`
- `signin`: find user by email, then `bcrypt.compare(password, user.password)` instead of querying with plaintext password

### 1.3 Fix JWT_SECRET fallback

**File to modify:** `packages/backend-common/src/index.ts`

**Changes:**
- Remove `|| "1212"` fallback
- Throw at module load time if `process.env.JWT_SECRET` is missing:
  ```ts
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is required");
  }
  export const JWT_SECRET = process.env.JWT_SECRET;
  ```

### 1.4 Fix auth on endpoints

**Files to modify:**
- `apps/http-backend/src/routes/roomRoutes.ts`
- `apps/http-backend/src/middleware/userrMiddleware.ts` (rename + fix)

**Changes:**
1. Rename `userrMiddleware.ts` → `authMiddleware.ts` (fix typo)
2. Fix the "Unauthrized" typo in the middleware error message
3. Add `Middleware` guard to:
   - `GET /room/my-rooms` (currently has `req.userId` but no middleware)
   - `GET /room/chats/:roomId`
   - `GET /room/slug/:slug`
4. Update imports in `userRoutes.ts` and `roomRoutes.ts`

### 1.5 Add rate limiting

**Files to modify:**
- `apps/http-backend/package.json` — add `express-rate-limit`
- `apps/http-backend/src/index.ts` — create and apply rate limiters

**Changes:**
- Apply stricter limiter to `/api/v1/user/signup` and `/api/v1/user/signin` (e.g., 10 requests per 15 min)
- Apply general limiter to all `/api/v1/` routes (e.g., 100 per 15 min)

### 1.6 Restrict CORS

**File to modify:** `apps/http-backend/src/index.ts`

**Changes:**
- Replace `app.use(cors())` with:
  ```ts
  app.use(cors({
    origin: process.env.NODE_ENV === 'production'
      ? ['https://yourdomain.com']
      : ['http://localhost:3000', 'http://localhost:4000'],
    credentials: true,
  }));
  ```

### 1.7 Sanitize error responses

**Files to modify:**
- `apps/http-backend/src/routes/userRoutes.ts`
- `apps/http-backend/src/routes/roomRoutes.ts`

**Changes:**
- Replace all `catch` blocks that return `{ error }` or `{ Error: error }` with a safe generic message
- Use a helper pattern: `catch (error) { res.status(500).json({ message: "Internal server error" }) }`
- Log the actual error server-side with `console.error`

### 1.8 Fix typos

| Location | Before | After |
|----------|--------|-------|
| `apps/http-backend/src/middleware/userrMiddleware.ts` | filename `userrMiddleware` | `authMiddleware` |
| File line 27 | `"Unauthrized"` | `"Unauthorized"` |
| `userRoutes.ts:54` | `messaage` | `message` |
| `userRoutes.ts:78` | `Errro` | `Error` |
| `roomRoutes.ts:26` | `Error: error` | `message: "Failed to create room"` |

All import references updated accordingly.

## WS Backend Changes

### WS auth hardening
Currently token is extracted from URL query param (`?token=`). Move it to a `type: "auth"` message sent right after connection:
- Client connects → server stores as unauthenticated
- Client sends `{ type: "auth", token: "..." }`
- Server verifies, then allows `join_room`/`chat`/etc
- Drop connection if no auth received within 5 seconds

**File to modify:** `apps/ws-backend/src/index.ts`
