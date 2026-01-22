# 🌌 GALAXY CONQUEST — Massively Multiplayer Web Game (MMO)

Space-themed online multiplayer strategy game where thousands of players conquer the galaxy together.

## 🎮 Game Concept

- **Massive Multiplayer Online (MMO)** - Thousands of players online simultaneously
- **Strategy & Conquest** - Maps, galaxies, planets to control
- **Resource Management** - Collect resources (metal, gas, crystal) from planets
- **Fleet & Battle System** - Build fleets, attack, defend
- **Alliance & Diplomacy** - Form alliances, wage war, make treaties
- **Events & Seasons** - Global events, leaderboards, seasonal rewards

## 🚀 Features

- ✅ Real-time multiplayer matchmaking
- ✅ Large-scale PvP & PvE battles
- ✅ Player-driven economy
- ✅ Alliance & Guild system
- ✅ Leaderboards & rating
- ✅ Daily/weekly missions
- ✅ Chat & notifications (global + alliance)
- ✅ Planet management + upgrade system
- ✅ Fleet movement & combat resolution
- ✅ Anti-cheat + server authoritative logic
- ✅ Offline progression (idle resource generation)
- ✅ Seasonal ranking & reward system

## 🏗️ Tech Stack

### Backend
- **Nest.js** - Microservices structure
- **PostgreSQL** - Main database
- **Redis** - Real-time state + matchmaking
- **WebSocket/Socket.IO** - Real-time communication
- **BullMQ** - Jobs (resource ticks, battle resolution)
- **JWT + Refresh token** - Authentication

### Frontend
- **Next.js + React** - Modern web framework
- **Canvas/PixiJS** - Render map & fleets
- **Tailwind CSS** - Styling
- **WebSocket client** - Real-time updates

## 📁 Project Structure

```
galaxy-conquest/
├── backend/          # Nest.js backend
│   ├── src/
│   │   ├── auth/     # Authentication
│   │   ├── users/    # User management
│   │   ├── planets/  # Planet system
│   │   ├── fleets/   # Fleet management
│   │   ├── battles/  # Battle system
│   │   ├── alliances/# Alliance system
│   │   ├── leaderboard/ # Leaderboards
│   │   ├── game/     # Game tick system
│   │   └── websocket/# Real-time communication
│   └── package.json
├── frontend/         # Next.js frontend
│   ├── app/         # Next.js app router
│   ├── components/  # React components
│   ├── lib/         # Utilities
│   └── store/       # State management
├── SETUP.md         # Detailed setup guide
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 6+

### Installation

1. **Install dependencies:**
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

2. **Set up environment variables:**
   - Copy `backend/.env.example` to `backend/.env` and configure
   - Copy `frontend/.env.example` to `frontend/.env.local` and configure

3. **Start PostgreSQL and Redis services**

4. **Run database seed (optional):**
```bash
cd backend
npm run seed
```

5. **Start development servers:**
```bash
# From root directory
npm run dev

# Or separately:
# Backend: cd backend && npm run start:dev
# Frontend: cd frontend && npm run dev
```

### Access
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

## 📖 Detailed Setup

See [SETUP.md](./SETUP.md) for comprehensive setup instructions.

## 🎯 Development Plan

1. ✅ Core backend & auth
2. ✅ Planet & resource system
3. ✅ Fleet & battle system
4. ✅ Alliance system
5. ✅ Leaderboard & events
6. ✅ Frontend map & UI
7. ✅ WebSocket real-time sync
8. ✅ Anti-cheat & performance optimizations

## 🎮 Game Mechanics

### Resource Generation
- Planets generate resources every minute (game tick)
- Resource generation depends on building levels
- Offline progression supported

### Fleet System
- Build ships (fighter, bomber, cruiser, destroyer, battleship)
- Send fleets to other planets
- Attack or transport resources
- Real-time fleet movement tracking

### Battle System
- Server-authoritative combat resolution
- Rating-based Elo system
- Resource stealing on victory
- Battle logs and history

### Alliances
- Create or join alliances (max 50 members)
- Alliance leaderboards
- Shared goals and coordination

## 🔒 Security

- JWT authentication with refresh tokens
- Server-authoritative game logic
- Input validation and sanitization
- Rate limiting ready

## 📝 License

MIT

## 🙏 Credits

Built with modern web technologies for a professional MMO experience.
