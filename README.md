# Bibliotica - Library Management System

## Tech Stack

### Backend

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** Supabase (PostgreSQL)
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs

### Frontend

- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **Routing:** React Router v6

### Infrastructure

- **Backend Hosting:** Railway (free tier)
- **Database:** Supabase (free tier)
- **Storage:** Supabase Storage (for book covers)

---

## Project Structure

```
bibliotica/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── config/         # Configuration (Supabase client)
│   │   ├── routes/         # API route handlers
│   │   └── index.js        # Express app entry point
│   └── package.json
│
├── frontend/               # React + Vite app
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── pages/admin/   # Admin page components
│   │   ├── services/      # API service functions
│   │   ├── config/        # Configuration (API endpoints)
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # React entry point
│   └── package.json
│
├── supabase_migration.sql  # Database schema + RLS policies
├── .env.example           # Environment variables template
└── README.md
```

---

## Setup Instructions

### 1. Supabase Setup

1. Create project at [supabase.com](https://supabase.com)
2. Go to SQL Editor → Run `supabase_migration.sql`
3. Configure Authentication (enable Email provider)
4. Create storage bucket named `book-covers` (public)
5. Copy your Project URL and anon key from Settings → API

### 2. Backend Setup

```bash
cd backend
npm install
cp ../.env.example .env
# Edit .env with your Supabase credentials
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
cp ../.env.example .env
# Edit .env with your Supabase and API credentials
npm run dev
```

---

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/admin/login` - Admin login
- `GET /api/auth/verify` - Verify token

### Users

- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update profile
- `GET /api/users/stats` - Get user stats

### Books

- `GET /api/books` - List all books (supports ?search=&genre=&available=)
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Add book (admin)
- `PUT /api/books/:id` - Update book (admin)
- `DELETE /api/books/:id` - Delete book (admin)

### Borrowing

- `POST /api/borrow/borrow` - Borrow a book
- `GET /api/borrow/my-borrows` - Get user's borrowed books
- `POST /api/borrow/return` - Return a book
- `GET /api/borrow/all` - Get all borrowed books (admin)

### Book Requests

- `POST /api/requests` - Create book request
- `GET /api/requests/my-requests` - Get user's requests
- `GET /api/requests/all` - Get all requests (admin)
- `PUT /api/requests/:id` - Update request status (admin)
- `POST /api/requests/:id/accept` - Accept request (admin)
- `POST /api/requests/:id/reject` - Reject request (admin)

### Notifications

- `GET /api/notifications` - Get user notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PUT /api/notifications/:id/read` - Mark as read
- `DELETE /api/notifications/:id` - Delete notification
- `DELETE /api/notifications/delete-all` - Delete all

### Orders

- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/all` - Get all orders (admin)

### Admin

- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/users` - List all users
- `GET /api/admin/returned` - Get returned books history
- `GET /api/admin/stats` - Get statistics by period

---

## Deployment

### Deploy Backend to Railway

1. Push code to GitHub
2. Connect Railway to GitHub repo
3. Add environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `JWT_SECRET`
4. Deploy!

### Frontend Deploy Options

- Vercel
- Netlify
- GitHub Pages

---

## Environment Variables

### Backend (.env)

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
JWT_SECRET=your-secret-key
NODE_ENV=production
PORT=3000
```

### Frontend (.env)

```
VITE_API_URL=https://your-backend.railway.app
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```
