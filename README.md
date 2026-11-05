# Username Collector

A small website for collecting usernames and saving them to MongoDB.

## Setup

1. Install Node.js 18 or newer.
2. Install dependencies with `npm install`.
3. Copy `.env.example` to `.env`.
4. Add your MongoDB connection string to `MONGODB_URI` in `.env`.
5. Start the website with `npm start` and open <http://localhost:3000>.

## Deploying to Vercel

Import the repository into Vercel and set the project's Root Directory to the
repository root (leave it blank or set it to `.`), not `public`. Vercel serves
the files in `public/` and deploys `api/users.js` as the `/api/users` serverless
function.
In the Vercel project settings, add `MONGODB_URI` (and optionally
`MONGODB_DATABASE`) under Environment Variables, then redeploy. Do not commit
the MongoDB URI or put it in a `NEXT_PUBLIC_` variable.

The app writes submissions to the `users` collection in the database named by
`MONGODB_DATABASE` (defaults to `username_collector`). Each document includes a
`username` and `createdAt` timestamp. Keep `.env` private; the connection URI is
read only by the server.
