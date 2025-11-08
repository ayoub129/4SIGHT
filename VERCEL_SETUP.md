# Vercel Postgres Setup Guide

This project uses **Vercel Postgres** instead of SQLite, which is required for Vercel hosting.

## Setup Steps

### 1. Create Vercel Postgres Database

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project (or create a new one)
3. Go to the **Storage** tab
4. Click **Create Database**
5. Select **Postgres**
6. Choose a name for your database (e.g., "4sight-db")
7. Select a region closest to your users
8. Click **Create**

### 2. Get Connection String

After creating the database:

1. Go to the **Storage** tab in your Vercel project
2. Click on your Postgres database
3. Go to the **.env.local** tab
4. Copy the `POSTGRES_URL` connection string

### 3. Add Environment Variables

Add these to your Vercel project environment variables:

1. Go to your project **Settings** → **Environment Variables**
2. Add the following variables:

```
POSTGRES_URL=your_postgres_url_here
POSTGRES_PRISMA_URL=your_prisma_url_here (if available)
POSTGRES_URL_NON_POOLING=your_non_pooling_url_here (if available)
```

**OR** if you're using `.env.local` locally, add:

```env
POSTGRES_URL=your_postgres_url_here
```

### 4. Deploy

The database tables will be created automatically on first use. The `@vercel/postgres` package automatically uses the `POSTGRES_URL` environment variable.

## Admin Credentials

- **Email**: `admin.4sight@gmail.com`
- **Password**: `4sightadmin123`

## Local Development

For local development, you can:

1. Use the same Vercel Postgres database (recommended)
2. Or use a local Postgres instance and set `POSTGRES_URL` in your `.env.local`

## Notes

- The database will be automatically initialized on first API call
- All tables are created automatically
- The admin user is created automatically on first initialization
- Order numbers start from 27 and increment sequentially

