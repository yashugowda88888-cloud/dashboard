# Premium Edge Dashboard

A secure, role-based dashboard built with Next.js, NextAuth, Drizzle ORM, and Neon DB.

## Features
- **Authentication**: Secure login and signup powered by NextAuth.js.
- **Role-Based Access**: Distinguishes between `admin` and `user` roles.
- **Admin Approval**: New users require admin approval before they can access the dashboard.
- **Premium UI**: Modern dark-themed design with glassmorphism and smooth animations.
- **Serverless Ready**: Optimized for deployment on Vercel and Neon DB.

## Setup Instructions

### 1. Database Setup (Neon)
1. Go to [Neon.tech](https://neon.tech) and create a new project.
2. Get your **Connection String** (Postgres URL).
3. Ensure it includes `sslmode=require`.

### 2. Environment Variables
Create a `.env.local` file in the root directory (or set these in Vercel):
```env
DATABASE_URL=your_neon_connection_string
NEXTAUTH_SECRET=a_random_secure_string
NEXTAUTH_URL=http://localhost:3000
```

### 3. Database Migration
Run the following command to create the necessary tables in your Neon DB:
```bash
npx drizzle-kit push
```

### 4. Deployment to Vercel
1. Push your code to a GitHub repository.
2. Import the project into Vercel.
3. Add the environment variables from step 2 in the Vercel project settings.
4. Deploy!

## First Admin Account
The **first user** to sign up is automatically granted the `admin` role and is pre-approved. All subsequent users will be registered as pending `user` roles and must be approved by an admin via the "Manage Users" section in the dashboard.
