# Shopping Prices App

This is a Next.js (React + TypeScript) app for managing shopping item prices, with PostgreSQL backend and Okta authentication. There are two roles:
- **Users**: Can view item prices
- **Admins**: Can set item prices

## Features
- Sign in with Okta
- Role-based access (user/admin)
- PostgreSQL for item/price storage

## Getting Started
1. Install dependencies: `npm install`
2. Set up your PostgreSQL database and update the connection string in `.env`
3. Configure Okta credentials in `.env`
4. Run the development server: `npm run dev`

## Project Structure
- `src/` - Main source code
- `app/` - Next.js App Router
- `pages/api/` - API routes

---

Replace this README with more details as you build your app.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## API Routes

This directory contains example API routes for the headless API app.

For more details, see [route.js file convention](https://nextjs.org/docs/app/api-reference/file-conventions/route).
