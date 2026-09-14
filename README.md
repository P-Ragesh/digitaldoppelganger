# DOPPELGANGER — Event Topic-Selection System

DOPPELGANGER is a complete, modern, responsive full-stack web application designed for live events where participants log in using their Name and College Name, spin an interactive glowing wheel, and receive a persistently assigned, unique event topic challenge.

## Features & Highlights

- **Single Topic Allocation**: Atomic database transactions guarantee each topic is assigned to exactly ONE participant.
- **Persistent Re-login**: Participants logging back in immediately retrieve their already assigned challenge certificate.
- **Event-Ready Spin Wheel**: Interactive 10-segment wheel with deceleration animation, stopping alignment math, and Web Audio API synthesized tick & fanfare sound effects.
- **Envelope Reveal & Challenge Certificate**: Animated sealed envelope popup leading to an authentic physical paper-style challenge document.
- **Comprehensive Admin Panel**: Real-time stats dashboard, Topic CRUD management, Participant tracking, Assignment resets, and CSV report export.

---

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Lucide Icons, Web Audio API.
- **Backend**: Node.js, Express.js, JSON Web Tokens (JWT), Express Rate Limit.
- **Database / ORM**: SQLite (for instant zero-configuration local execution) / PostgreSQL compatible, Prisma ORM.

---

## Quick Start & Installation

### 1. Install Dependencies
Run the setup command from the project root:
```bash
npm run setup
```
*(This installs packages for both `server` and `client`)*

### 2. Configure Database & Seed Initial Topics
Navigate to the `server` directory and push the database schema:
```bash
cd server
npx prisma db push
npx prisma db seed
cd ..
```

### 3. Run Development Servers
Start both backend (Port 5000) and frontend (Port 3000) concurrently:
```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3000`.

---

## Default Credentials

### Admin Login
- **Username**: `admin`
- **Password**: `adminpassword123`

---

## Production Build

To build the client application for production:
```bash
npm run build --prefix client
```

To run the production server:
```bash
npm start --prefix server
```
