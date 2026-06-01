# English Quest Backend

Backend API for English Quest, a gamified English learning platform built with NestJS, Prisma, PostgreSQL, JWT Authentication, Cloudinary, and Swagger.

## Features

* JWT Authentication
* Refresh Tokens
* Role-Based Access Control (Admin / Student)
* Levels and Missions Management
* Questions and Quiz System
* User Progress Tracking
* XP and Streak System
* Achievements & Badges
* Leaderboard
* Profile Management
* Cloudinary Image Upload
* Swagger Documentation

## Tech Stack

* NestJS
* TypeScript
* Prisma ORM
* PostgreSQL / Neon
* JWT
* Cloudinary
* Swagger

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file:

```env
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## Database

Generate Prisma Client:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate dev
```

Seed database:

```bash
npx prisma db seed
```

## Running the Project

Development:

```bash
npm run start:dev
```

Production:

```bash
npm run build
npm run start:prod
```

## Swagger Documentation

Available at:

```txt
http://localhost:4000/api/docs
```

## Main Modules

* Auth
* Users
* Levels
* Missions
* Questions
* Progress
* Leaderboard
* Admin

## Project Goal

English Quest Backend provides the API layer and business logic for a gamified English learning platform with progression, achievements, and learning analytics.
