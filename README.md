# 4SIGHT - The Hands of Chance

A cinematic book showcase and e-commerce platform for "4SIGHT: The Hands of Chance" by Ace Strider. Features stunning animations, special edition book covers, and integrated Square payment processing.

![4SIGHT](https://img.shields.io/badge/4SIGHT-The%20Hands%20of%20Chance-red)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black)

## 📖 About

4SIGHT is a visually stunning book landing page featuring:
- Cinematic camera flash animation on page load
- Special edition book covers with rarity badges
- Interactive book showcase with modal lightbox
- Integrated Square payment processing
- Admin dashboard for order management
- Responsive design with dark/light mode support

## ✨ Features

### Frontend
- **Hero Section**: Animated camera flash sequence with photographer walking animation
- **Book Showcase**: Three special edition covers (Red, Yellow, White) with rarity indicators
- **Interactive Elements**: Clickable book covers that open in a modal lightbox
- **Random Card Drops**: 10% chance of playing cards falling from the sky
- **Falling Cards Background**: Animated background with falling playing cards
- **Story Section**: Narrative section about the book
- **Responsive Design**: Mobile-first design with Tailwind CSS

### E-commerce
- **Format Selection**: Choose between Ebook ($4.99) or Paper Book ($14.99)
- **Square Payment Integration**: Secure checkout powered by Square
- **Order Tracking**: Sequential order numbers starting from 27
- **Email Collection**: Customer email collection before checkout

### Admin Dashboard
- **Order Management**: View all orders with customer details
- **Secure Login**: Admin authentication system
- **Order Details**: See order number, email, format, price, and date

## 🛠️ Tech Stack

- **Framework**: Next.js 16.0 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.1
- **Database**: PostgreSQL (via `pg` - works with Neon, Supabase, Prisma Postgres, etc.)
- **Payment**: Square Payment Links API
- **Animations**: Framer Motion, CSS Animations
- **UI Components**: Radix UI
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 20+ 
- npm or pnpm
- A Square Developer account
- A PostgreSQL database (Neon, Supabase, Prisma Postgres, etc.)
- A Vercel account (for deployment)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd code
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Square Payment Configuration
SQUARE_APPLICATION_ID=your_square_application_id
SQUARE_ACCESS_TOKEN=your_square_access_token
SQUARE_LOCATION_ID=your_square_location_id
SQUARE_ENVIRONMENT=sandbox  # or "production"

# Database Configuration
POSTGRES_URL=your_postgres_connection_string
# OR
DATABASE_URL=your_postgres_connection_string

# Application URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000  # or your production URL
```

### 4. Run Development Server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Configuration

### Square Payment Setup

1. **Create Square Developer Account**
   - Go to https://developer.squareup.com/
   - Sign up or log in

2. **Create Application**
   - Navigate to Developer Dashboard → Applications
   - Click "New Application"
   - Copy your Application ID

3. **Get Access Token**
   - In your application, go to Credentials tab
   - Copy Sandbox or Production Access Token

4. **Get Location ID**
   - Go to https://squareup.com/dashboard/locations
   - Select your location and copy the Location ID

5. **Add to Environment Variables**
   - Add all Square credentials to `.env.local` (local) or Vercel Environment Variables (production)

### Database Setup

This project uses PostgreSQL and works with any Postgres provider:

#### Option 1: Neon (Recommended for Vercel)
1. Go to Vercel Dashboard → Your Project → Storage
2. Click "Create Database" or "Browse Marketplace"
3. Select "Neon" (Serverless Postgres)
4. Follow setup wizard
5. Connection string is automatically added

#### Option 2: Supabase
1. Go to Vercel Dashboard → Storage → Browse Marketplace
2. Select "Supabase"
3. Connect account or create new project
4. Connection string is automatically added

#### Option 3: Prisma Postgres
1. Go to Vercel Dashboard → Storage → Browse Marketplace
2. Select "Prisma Postgres"
3. Follow setup wizard

The database tables are created automatically on first use:
- `orders` - Stores all order information
- `admin_users` - Stores admin login credentials
- `order_counter` - Tracks sequential order numbers

## 👤 Admin Access

### Default Admin Credentials
- **Email**: `admin.4sight@gmail.com`
- **Password**: `4sightadmin123`

### Access Admin Dashboard
1. Navigate to `/admin/login`
2. Enter admin credentials
3. View orders at `/admin/dashboard`

**Note**: The admin user is created automatically on first database initialization.

## 📁 Project Structure

```
code/
├── app/
│   ├── admin/              # Admin pages
│   │   ├── dashboard/     # Order management dashboard
│   │   └── login/         # Admin login page
│   ├── api/               # API routes
│   │   ├── admin/         # Admin API endpoints
│   │   ├── orders/        # Order management API
│   │   └── square-checkout/  # Square payment API
│   ├── checkout/          # Checkout pages
│   │   ├── page.tsx      # Checkout form
│   │   └── success/      # Success page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/
│   ├── book-showcase.tsx  # Special edition covers showcase
│   ├── camera-flash.tsx   # Camera flash animation
│   ├── falling-cards.tsx # Background falling cards
│   ├── footer.tsx        # Footer component
│   ├── hero-section.tsx  # Hero section with pre-order form
│   ├── random-card-drop.tsx  # Random card drops
│   ├── story-section.tsx # Story narrative section
│   └── ui/               # Reusable UI components
├── lib/
│   ├── db.ts             # Database connection and queries
│   ├── order-number.ts   # Sequential order number logic
│   └── utils.ts          # Utility functions
├── public/
│   └── cards-cover/      # Book cover images and cards
└── package.json
```

## 🎨 Special Edition Covers

The app features three special edition book covers:

1. **Red Edition** (Ultra Rare)
   - Only 10 copies
   - Randomly distributed
   - Includes matching red playing cards

2. **Yellow Edition** (Ultra Rare)
   - Only 10 copies
   - Randomly distributed
   - Includes matching yellow playing cards

3. **White Edition** (Pre-order Guaranteed)
   - First 100 pre-orders guaranteed
   - Then 900 more copies available
   - Includes matching white playing cards

## 🚢 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all required variables (see Environment Variables section)
   - Make sure to select all environments (Production, Preview, Development)

4. **Connect Database**
   - Go to Storage tab
   - Create or connect a Postgres database
   - Connection string is automatically added

5. **Redeploy**
   - After adding environment variables, redeploy
   - Go to Deployments → Latest → ⋯ → Redeploy

### Important Notes for Deployment

- **Always redeploy after adding environment variables**
- Database tables are created automatically on first API call
- Admin user is created automatically on first database initialization
- Make sure `NEXT_PUBLIC_BASE_URL` matches your Vercel domain

## 🐛 Troubleshooting

### "Square credentials not configured" Error
- Verify all Square environment variables are set in Vercel
- Make sure you redeployed after adding variables
- Check Vercel function logs for specific missing variables

### Database Connection Error
- Verify `POSTGRES_URL` or `DATABASE_URL` is set
- Check that your database is active in Vercel Storage
- Ensure SSL is enabled for production connections

### 500 Internal Server Error
- Check Vercel function logs: Deployments → Latest → Functions → `api/square-checkout`
- Verify all environment variables are set correctly
- Check that database connection is working
- Review error messages in browser console

### Admin Login Not Working
- Verify database is connected and initialized
- Check that admin user was created (first API call creates it)
- Verify session cookies are enabled in browser

## 📝 Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Linting
npm run lint         # Run ESLint
```

## 🔒 Security Notes

- **Never commit** `.env.local` or environment variables to Git
- Use different Square credentials for sandbox (testing) and production
- Rotate access tokens regularly
- Keep admin credentials secure
- Use HTTPS in production (automatically handled by Vercel)

## 📄 License

This project is private and proprietary.

## 👨‍💻 Author

**Ace Strider**
- Instagram: [@ace.d.strider](https://instagram.com/ace.d.strider)
- Instagram: [@omarmhammouda](https://instagram.com/omarmhammouda)
- Instagram: [@fore4sight](https://instagram.com/fore4sight)

## 🙏 Acknowledgments

- Square for payment processing
- Vercel for hosting and deployment
- Next.js team for the amazing framework
- All contributors and supporters

---

**4SIGHT: The Hands of Chance** - Where perception meets destiny.

