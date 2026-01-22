# 🚀 Galaxy Conquest - Setup Guide

## Prerequisites

- **Node.js** 18+ 
- **PostgreSQL** 14+
- **Redis** 6+
- **npm** or **yarn**

## Installation Steps

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Database Setup

1. Create PostgreSQL database:
```sql
CREATE DATABASE galaxy_conquest;
```

2. Update `backend/.env` with your database credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=galaxy_conquest
```

3. The database will auto-sync in development mode (synchronize: true)

### 3. Redis Setup

1. Start Redis server:
```bash
# Windows (if installed via chocolatey)
redis-server

# Linux/Mac
redis-server
```

2. Update `backend/.env` if needed:
```env
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 4. Environment Variables

#### Backend (`backend/.env`)
```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=galaxy_conquest

REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_REFRESH_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:3001
```

#### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=http://localhost:3000
```

### 5. Run the Application

#### Development Mode

From the root directory:
```bash
npm run dev
```

This will start both backend (port 3000) and frontend (port 3001).

Or run separately:

**Backend:**
```bash
cd backend
npm run start:dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### 6. Access the Application

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

## First Steps

1. Register a new account at http://localhost:3001/auth/register
2. Login and explore the dashboard
3. View the galaxy map
4. Start building your empire!

## Project Structure

```
galaxy-conquest/
├── backend/              # Nest.js backend
│   ├── src/
│   │   ├── auth/        # Authentication
│   │   ├── users/       # User management
│   │   ├── planets/     # Planet system
│   │   ├── fleets/      # Fleet management
│   │   ├── battles/     # Battle system
│   │   ├── alliances/   # Alliance system
│   │   ├── leaderboard/ # Leaderboards
│   │   ├── game/        # Game tick system
│   │   └── websocket/   # Real-time communication
│   └── package.json
├── frontend/            # Next.js frontend
│   ├── app/            # Next.js app router
│   ├── components/     # React components
│   ├── lib/            # Utilities
│   └── store/          # State management
└── README.md
```

## Features

✅ User authentication (JWT + Refresh tokens)
✅ Planet management & resource generation
✅ Fleet building & movement
✅ Battle system
✅ Alliance system
✅ Leaderboards
✅ Real-time WebSocket updates
✅ Game tick system (runs every minute)

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database exists

### Redis Connection Error
- Ensure Redis is running
- Check Redis connection in `.env`

### Port Already in Use
- Change ports in `.env` files
- Kill processes using ports 3000/3001

## Production Deployment

1. Set `NODE_ENV=production` in backend `.env`
2. Build both projects:
```bash
npm run build
```
3. Start production servers:
```bash
cd backend && npm run start:prod
cd frontend && npm run start
```

## Support

For issues or questions, check the codebase or create an issue.
