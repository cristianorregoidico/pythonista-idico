# Pytonista MVP

A functional MVP inspired by laramap.dev, but focused on Python developers.

## Features

- Landing page with CTA
- Fullscreen homepage map with hideable left drawer
- Floating country filter on homepage map
- Multi-step registration wizard (5 steps)
- Credentials auth (register/login/logout)
- Password hashing with bcrypt
- Session cookie with signed JWT
- SQLite persistence with Prisma
- Local image upload to `public/uploads`
- Geocoding city -> latitude/longitude (OpenStreetMap Nominatim)
- Leaflet map with markers and popups
- Search/filter by city and Python version

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Prisma + SQLite
- react-leaflet + leaflet
- zod validation

## Requirements

- Node.js 20+
- npm

## Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

`.env.example`

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="replace-with-a-long-random-secret"
GEOCODER_USER_AGENT="pytonista-mvp/1.0 (local-dev)"
```

## Installation

```bash
npm install
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

Open `http://localhost:3000`.

## Main Routes

- `/` landing
- `/` fullscreen public map with left drawer + country filter
- `/register` multi-step registration wizard
- `/login` login page
- `/map` public map page with user markers

## Scripts

- `npm run dev` start dev server
- `npm run build` production build
- `npm run start` run production server
- `npm run lint` run eslint
- `npm run prisma:migrate` run prisma migrations
- `npm run prisma:generate` generate prisma client
- `npm run prisma:seed` seed sample users

## Notes

- Uploaded profile images are stored locally in `public/uploads`.
- Geocoding uses the free OpenStreetMap Nominatim API.
- Registration includes frontend and backend validation.
- Sample seed users use password: `password123`.
