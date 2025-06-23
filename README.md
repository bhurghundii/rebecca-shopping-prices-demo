# Shopping Prices Demo

This is a Next.js (React + TypeScript) app for managing shopping item prices, with PostgreSQL backend and Auth0 authentication. There are two roles:
- **Users**: Can view item prices
- **Admins**: Can set item prices

## Features
- Sign in with Auth0
- Role-based access (user/admin)
- PostgreSQL for item/price storage

## Getting Started
1. Install dependencies: `npm install`
2. Start PostgreSQL using Docker Compose: `docker-compose up -d`
3. Set up your Auth0 credentials in `.env.local`
4. Run the development server: `npm run dev`

## Project Structure
- `src/` - Main source code
  - `app/` - Next.js App Router components
  - `lib/` - Utility functions
  - `middleware.ts` - Auth middleware
- `prisma/` - Database schema and migrations

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
