<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/98f6e3bf-1c2c-4d21-82dd-3c8906a640f6">
  <img alt="Excalidraw" src="https://github.com/user-attachments/assets/98f6e3bf-1c2c-4d21-82dd-3c8906a640f6">
</picture>

<div align="center">
  <h1>Excalidraw Lite</h1>
  <p><strong>Real-time collaborative whiteboard</strong></p>

  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#project-structure">Project Structure</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16-000000?logo=next.js" alt="Next.js 16">
    <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript" alt="TypeScript">
    <img src="https://img.shields.io/badge/Express-5-000000?logo=express" alt="Express">
    <img src="https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma" alt="Prisma">
    <img src="https://img.shields.io/badge/PostgreSQL-Neon-316192?logo=postgresql" alt="PostgreSQL">
    <img src="https://img.shields.io/badge/Turborepo-2-EF4444?logo=turborepo" alt="Turborepo">
  </p>
</div>

A real-time collaborative drawing application that lets multiple users draw on a shared canvas simultaneously. Built with a modern monorepo architecture using Next.js, Express, WebSockets, and PostgreSQL.

## Features

- **User Authentication** — Sign up and sign in with JWT-based authentication
- **Drawing Rooms** — Create and join drawing rooms with unique shareable slugs
- **Real-Time Collaboration** — WebSocket-powered live canvas synchronization
- **Drawing Tools** — Rectangle, Circle, Ellipse, Triangle, Line, and Freehand Pencil
- **Color Picker** — Configurable stroke color for shapes
- **Data Persistence** — All shapes saved to PostgreSQL and restored on room join
- **Keyboard Shortcuts** — Quick tool switching (V/R/C/E/T/L)

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16, React 19, Tailwind CSS v4 |
| **REST API** | Express 5 |
| **WebSockets** | ws (Node.js) |
| **Auth** | JSON Web Tokens (JWT) |
| **Validation** | Zod v4 |
| **Database** | PostgreSQL (Neon + Prisma ORM v7) |
| **Language** | TypeScript (100%) |
| **Monorepo** | Turborepo v2 + pnpm v9 |

## Architecture

```
Client (Next.js)  ──HTTP──▶  http-backend (Express :8000)
      │
      └────────────WS──────▶  ws-backend (WebSocket :8080)
                                    │
                                    ▼
                              PostgreSQL (Neon)
```

- The **Next.js frontend** communicates with the Express REST API for authentication and room management over HTTP.
- The **WebSocket server** handles real-time shape broadcasting — when a user draws, the shape is serialized to JSON, sent via WebSocket, persisted to the database, and broadcast to all other users in the same room.
- On joining a room, the last 50 shapes are fetched and rendered on the canvas.

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm 9
- PostgreSQL (or a Neon serverless connection string)

### Installation

```sh
git clone <repo-url>
cd excalidraw
pnpm install
```

### Environment Variables

Create `.env` files for each app and package that requires them:

**`apps/http-backend/.env`**
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
PORT=8000
```

**`apps/ws-backend/.env`**
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
PORT=8080
```

### Database

Run Prisma migrations to set up the database schema:

```sh
cd packages/db
pnpm prisma migrate dev
cd ../..
```

### Development

Run all apps in development mode:

```sh
pnpm dev
```

This starts:
- **Frontend** → [http://localhost:4000](http://localhost:4000)
- **HTTP Backend** → [http://localhost:8000](http://localhost:8000)
- **WebSocket Backend** → ws://localhost:8080

### Build

```sh
pnpm build
```

## Project Structure

```
excalidraw/
├── apps/
│   ├── excalidraw-fe/       # Next.js 16 frontend
│   ├── http-backend/        # Express REST API (auth, rooms)
│   ├── ws-backend/          # WebSocket server (real-time sync)
│   └── docs/                # (unused stub)
├── packages/
│   ├── common/              # Shared Zod schemas & types
│   ├── backend-common/      # Shared backend config (JWT secret)
│   ├── db/                  # Prisma schema, migrations & client
│   ├── ui/                  # Shared UI components
│   ├── eslint-config/       # Shared ESLint configs
│   └── typescript-config/   # Shared TypeScript configs
├── turbo.json               # Turborepo pipeline
├── pnpm-workspace.yaml      # pnpm workspace config
└── package.json             # Root scripts
```

## License

[MIT](LICENSE)
