# Database Setup Guide for Vercel

This project uses **Postgres** which works with any Postgres provider available in Vercel's Marketplace.

## Available Database Options

You can choose any of these Postgres providers from Vercel's Marketplace:

1. **Neon** - Serverless Postgres (Recommended)
2. **Supabase** - Postgres backend
3. **Prisma Postgres** - Instant Serverless Postgres
4. **Nile** - Postgres re-engineered for B2B

## Setup Steps

### Option 1: Using Neon (Recommended)

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project
3. Go to the **Storage** tab
4. Click **Create Database** or **Browse Marketplace**
5. Select **Neon** (Serverless Postgres)
6. Follow the setup wizard
7. The connection string will be automatically added to your environment variables

### Option 2: Using Supabase

1. Go to your Vercel dashboard
2. Select your project
3. Go to the **Storage** tab
4. Click **Browse Marketplace**
5. Select **Supabase**
6. Connect your Supabase account or create a new project
7. The connection string will be automatically added

### Option 3: Using Prisma Postgres

1. Go to your Vercel dashboard
2. Select your project
3. Go to the **Storage** tab
4. Click **Browse Marketplace**
5. Select **Prisma Postgres**
6. Follow the setup wizard
7. The connection string will be automatically added

## Environment Variables

After connecting a database, Vercel will automatically add these environment variables:

- `POSTGRES_URL` - Main connection string
- `DATABASE_URL` - Alternative connection string (some providers use this)

**OR** if you're setting up manually, add to your `.env.local`:

```env
POSTGRES_URL=your_postgres_connection_string_here
# OR
DATABASE_URL=your_postgres_connection_string_here
```

## Database Initialization

The database tables will be created automatically on first use:
- `orders` - Stores all order information
- `admin_users` - Stores admin login credentials
- `order_counter` - Tracks sequential order numbers

## Admin Credentials

- **Email**: `admin.4sight@gmail.com`
- **Password**: `4sightadmin123`

The admin user is created automatically on first database initialization.

## Local Development

For local development:

1. Use the same database connection string from your Vercel project
2. Or set up a local Postgres instance and use its connection string
3. Add the connection string to your `.env.local` file

## Notes

- All database providers work the same way - just use the connection string they provide
- The code automatically handles SSL connections in production
- Order numbers start from 27 and increment sequentially
- Tables are created automatically on first API call
