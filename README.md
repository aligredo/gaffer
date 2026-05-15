# ⚽ Gaffer

> **5-a-side team generator** — create your tribe, rate your players, pick who's playing tonight, and let Gaffer split them into balanced teams in seconds.

![Dashboard](docs/screenshots/dashboard.png)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Local Setup — Docker (recommended)](#local-setup--docker-recommended)
- [Local Setup — Manual](#local-setup--manual)
- [Deploying on Railway](#deploying-on-railway)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Project Structure](#project-structure)

---

## Features

| Feature | Details |
|---|---|
| **Tribes** | Organise players into recurring groups (e.g. "Sunday League"). Each tribe has a name, description, and optional schedule. |
| **Player ratings** | Rate every player on five attributes — Pace, Shoot, Pass, Skill, Physical — each from 0–99. An *Overall* score is derived automatically. |
| **Positions** | Assign a best position: GK, DEF, ATT, or JOKER (versatile). |
| **Match generator** | Pick 10 or 12 players from your tribe roster; Gaffer assigns goalkeepers and snake-drafts outfield players by overall rating to produce two balanced teams. |
| **Balance delta** | After generation, see the average-rating difference between the two teams. Regenerate instantly if the split doesn't feel right. |
| **Match history** | Every confirmed match is stored with date, notes, and the full team sheet. |
| **JWT auth** | Secure, stateless authentication — each user only sees their own tribes. |

---

## Tech Stack

**Backend**
- [NestJS](https://nestjs.com/) (Node.js framework)
- [TypeORM](https://typeorm.io/) + PostgreSQL
- [Passport / JWT](https://www.passportjs.org/) for authentication
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js) for password hashing

**Frontend**
- [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) — dark navy/chalk design system
- [TanStack Query v5](https://tanstack.com/query) for server state
- [Zustand](https://zustand-demo.pmnd.rs/) for client state
- [Framer Motion](https://www.framer.com/motion/) for animations
- [React Router v6](https://reactrouter.com/)

**Infrastructure**
- Docker Compose (local)
- [Railway](https://railway.app/) (production)
- Nginx (static file server + reverse proxy for the API)

---

## Screenshots

### Dashboard — Your Tribes
> Create tribes for each group of players you play with regularly.

```
┌──────────────────────────────────────────┐
│  YOUR TRIBES                [CREATE TRIBE]│
│                                           │
│  ┌────────────┐  ┌────────────┐           │
│  │ Sunday Lads│  │ Work FC    │           │
│  │ Every Sun  │  │ Fridays 6pm│           │
│  │ 12 players │  │  8 players │           │
│  └────────────┘  └────────────┘           │
└──────────────────────────────────────────┘
```

### Tribe — Players & Matches
> Manage your squad and browse past matches in one place.

```
┌────────────────────────────────────────────────────┐
│  SUNDAY LADS                                        │
│  [PLAYERS]  [MATCHES]                [ADD PLAYER]  │
│                                                     │
│  ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐           │
│  │ Ali   │ │ James │ │ Sara  │ │ Mo    │           │
│  │  GK   │ │  DEF  │ │  ATT  │ │ JOKER │           │
│  │  OVR  │ │  OVR  │ │  OVR  │ │  OVR  │           │
│  │  78   │ │  74   │ │  82   │ │  71   │           │
│  └───────┘ └───────┘ └───────┘ └───────┘           │
└────────────────────────────────────────────────────┘
```

### Player Card — Attribute Sliders
> Set ratings for all five attributes when adding or editing a player.

```
ADD PLAYER
  Name:      [ Ali Hassan       ]
  Position:  [GK] DEF  ATT  JOKER

  Pace     ────────●───  72
  Shoot    ──────●─────  65
  Pass     ───────●────  70
  Skill    ────────●───  74
  Physical ─────●──────  68

                      [  SAVE  ]
```

### Match Generator — 3-Step Flow

**Step 1 — Match details**
```
  ① ── ② ── ③   MATCH DETAILS
  Date:   [ 2024-11-17 ]
  Notes:  [ Park pitch, bring bibs ]
                         [ NEXT → ]
```

**Step 2 — Select players**
```
  ① ── ② ── ③   SELECT PLAYERS
  10 / 10–12 players selected      [GENERATE TEAMS]

  ✔ Ali    ✔ James  ✔ Sara    Mo
  ✔ Yusuf  ✔ Chen   ✔ Danny  ✔ Rosa
  ✔ Pete   ✔ Layla  ✔ Omar    Kai
```

**Step 3 — Balanced teams**
```
  ① ── ② ── ③   TEAMS  (Δ 1.2 OVR)

  TEAM A                TEAM B
  ─────────────────     ─────────────────
  Ali    GK  78         Sara   GK  82
  James  DEF 74         Rosa   DEF 72
  Pete   ATT 80         Danny  ATT 76
  Yusuf  MID 71         Chen   MID 73
  Layla  ATT 69         Omar   ATT 70

            [REGENERATE]  [CONFIRM & SAVE]
```

---

## Local Setup — Docker (recommended)

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) ≥ 24
- [Docker Compose](https://docs.docker.com/compose/) (included with Docker Desktop)

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/aligredo/gaffer.git
cd gaffer

# 2. Create your .env file
cp .env.example .env
# Edit .env and set a strong JWT_SECRET (see Environment Variables below)

# 3. Build and start the entire stack
docker compose up --build

# The app is now running at http://localhost
# API is available at http://localhost:3001
```

> **Tip:** Subsequent starts are faster without `--build`:
> ```bash
> docker compose up
> ```

> **Stop the stack:**
> ```bash
> docker compose down
> # To also delete the database volume:
> docker compose down -v
> ```

---

## Local Setup — Manual

Use this if you want hot-reload for development.

### Prerequisites

- Node.js ≥ 20
- PostgreSQL ≥ 15 running locally (or via Docker: `docker run -e POSTGRES_DB=gaffer -e POSTGRES_USER=gaffer -e POSTGRES_PASSWORD=gaffer_pw -p 5432:5432 postgres:15-alpine`)

### Backend

```bash
cd backend
npm install

# Set environment variables (or create a .env file in the backend directory)
export DATABASE_URL=postgres://gaffer:gaffer_pw@localhost:5432/gaffer
export JWT_SECRET=your_secret_here
export PORT=3001

# Start in watch mode (auto-restart on file changes)
npm run start:dev
```

The API will be available at `http://localhost:3001`.

### Frontend

```bash
cd frontend
npm install

# Point the frontend at the local API
export VITE_API_URL=http://localhost:3001

# Start Vite dev server with HMR
npm run dev
```

The frontend will be available at `http://localhost:5173`.

---

## Deploying on Railway

[Railway](https://railway.app/) can host the database, backend, and frontend as separate services from a single repository.

### 1 — Create a new project

1. Go to [railway.app](https://railway.app/) → **New Project** → **Deploy from GitHub repo**.
2. Select your fork/clone of `aligredo/gaffer`.

### 2 — Add a PostgreSQL database

1. In the Railway project dashboard, click **+ New** → **Database** → **PostgreSQL**.
2. Railway automatically sets `DATABASE_URL` as a shared variable. Copy it for later reference.

### 3 — Deploy the Backend service

1. Click **+ New** → **GitHub Repo** and select the repo again (or use the same deployment and configure the root path).
2. In the service settings:
   - **Root directory:** `backend`
   - **Build command:** `npm run build`
   - **Start command:** `node dist/main.js`
3. Add the following environment variables under **Variables**:

   | Variable | Value |
   |---|---|
   | `DATABASE_URL` | Reference the PostgreSQL service variable: `${{Postgres.DATABASE_URL}}` |
   | `JWT_SECRET` | A long random string (e.g. output of `openssl rand -hex 32`) |
   | `FRONTEND_URL` | The Railway domain of your frontend service (add after deploying it) |
   | `PORT` | `3001` |
   | `NODE_ENV` | `production` |

4. Deploy the service. Railway will run migrations via TypeORM `synchronize` on first boot.

### 4 — Deploy the Frontend service

1. Click **+ New** → **GitHub Repo** → same repo.
2. In the service settings:
   - **Root directory:** `frontend`
   - **Build command:** `npm run build`
   - **Start command:** *(leave empty — Railway will detect the static output and serve it, or use the included Nginx Dockerfile)*
   
   > If Railway doesn't detect the Nginx Dockerfile automatically, set **Dockerfile path** to `frontend/Dockerfile`.

3. Add the following build variable:

   | Variable | Value |
   |---|---|
   | `VITE_API_URL` | `/api` (Nginx proxies `/api` to the backend) |

4. Deploy the service.

### 5 — Wire up the domains

1. Copy the public domain Railway assigned to the **frontend** service.
2. Go back to the **backend** service → **Variables** → set `FRONTEND_URL` to the frontend domain (e.g. `https://gaffer-frontend.up.railway.app`).
3. Redeploy the backend.

Your app is live! 🎉

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `JWT_SECRET` | ✅ Yes | — | Secret key used to sign JWT tokens. Use a long random string in production. |
| `DATABASE_URL` | ✅ Yes | — | PostgreSQL connection string. Format: `postgres://user:pass@host:port/db` |
| `FRONTEND_URL` | No | `http://localhost` | Allowed CORS origin for the backend. |
| `PORT` | No | `3001` | Port the NestJS server listens on. |
| `NODE_ENV` | No | — | Set to `production` to disable TypeORM schema sync logs. |
| `VITE_API_URL` | Build-time | `/api` | Base URL the frontend uses for API calls. |

> Copy `.env.example` to `.env` and fill in the required values before starting locally.

---

## API Overview

All endpoints require a `Bearer <token>` header except `/auth/*`.

### Auth

| Method | Path | Description |
|---|---|---|
| `POST` | `/auth/register` | Register a new account `{ email, password }` |
| `POST` | `/auth/login` | Login — returns `{ access_token }` |

### Tribes

| Method | Path | Description |
|---|---|---|
| `GET` | `/tribes` | List all tribes for the authenticated user |
| `POST` | `/tribes` | Create a tribe `{ name, description?, schedule? }` |
| `GET` | `/tribes/:id` | Get a single tribe |
| `PATCH` | `/tribes/:id` | Update a tribe |
| `DELETE` | `/tribes/:id` | Delete a tribe and all its data |

### Players

| Method | Path | Description |
|---|---|---|
| `GET` | `/tribes/:tribeId/players` | List all players in a tribe |
| `POST` | `/tribes/:tribeId/players` | Add a player `{ name, bestPosition, pace, shoot, pass, skill, physical }` |
| `PATCH` | `/tribes/:tribeId/players/:id` | Update a player |
| `DELETE` | `/tribes/:tribeId/players/:id` | Remove a player |

### Matches

| Method | Path | Description |
|---|---|---|
| `GET` | `/tribes/:tribeId/matches` | List match history |
| `POST` | `/tribes/:tribeId/matches` | Create a draft match `{ date, notes? }` |
| `POST` | `/tribes/:tribeId/matches/:id/generate` | Generate teams `{ playerIds: string[] }` (10 or 12 IDs) |
| `POST` | `/tribes/:tribeId/matches/:id/confirm` | Confirm and save the match |
| `GET` | `/tribes/:tribeId/matches/:id` | Get a match with full team details |

#### Example — Generate Teams

```bash
curl -X POST https://your-backend/tribes/<tribeId>/matches/<matchId>/generate \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "playerIds": [
      "uuid-1", "uuid-2", "uuid-3", "uuid-4", "uuid-5",
      "uuid-6", "uuid-7", "uuid-8", "uuid-9", "uuid-10"
    ]
  }'
```

Response:
```json
{
  "teamA": {
    "starters": [{ "id": "...", "name": "Ali", "bestPosition": "GK", "pace": 78, "overall": 75 }],
    "sub": null
  },
  "teamB": {
    "starters": [{ "id": "...", "name": "Sara", "bestPosition": "GK", "pace": 82, "overall": 80 }],
    "sub": null
  },
  "balanceDelta": 1.2,
  "warnings": []
}
```

---

## Project Structure

```
gaffer/
├── backend/                  # NestJS API
│   ├── src/
│   │   ├── auth/             # JWT register/login
│   │   ├── tribes/           # Tribe CRUD
│   │   ├── players/          # Player CRUD
│   │   ├── matches/          # Match management + team generator
│   │   └── users/            # User entity
│   └── Dockerfile
├── frontend/                 # React + Vite SPA
│   ├── src/
│   │   ├── api/              # Axios API client
│   │   ├── components/       # UI components (PlayerCard, TeamResult, …)
│   │   ├── pages/            # Route-level pages
│   │   └── store/            # Zustand auth store
│   ├── nginx.conf            # Nginx config (serves SPA + proxies /api)
│   └── Dockerfile
├── docker-compose.yml        # Full local stack
└── .env.example              # Environment variable template
```

---

## License

MIT
