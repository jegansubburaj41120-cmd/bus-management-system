# 🚌 CampusTransit - Smart College Bus Management & Real-Time Tracking System

> **Production-Ready Full-Stack Transportation & Real-Time Telematics Platform for Higher Education Campuses.**

---

## 📁 Modular Directory Architecture

The codebase is organized into **separated frontend and backend** applications:

```text
bus-management-system/
├── backend/                       # Express.js REST API & MySQL Database
│   ├── config/
│   │   └── db.js                  # MySQL connection pool
│   ├── controllers/               # Business logic & endpoints
│   │   ├── analyticsController.js
│   │   ├── attendanceController.js
│   │   ├── authController.js
│   │   ├── busController.js
│   │   ├── gateController.js
│   │   ├── routeController.js
│   │   ├── studentController.js
│   │   └── tripController.js
│   ├── database/
│   │   ├── schema.sql             # Full DDL database schema with foreign keys
│   │   ├── initDb.js              # Automatic database creator
│   │   └── seed.js                # Realistic seed data populator
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT authentication and RBAC guards
│   ├── routes/                    # API Route definitions (/api/*)
│   ├── .env.example               # Backend environment variables template
│   ├── package.json               # Backend dependencies
│   └── server.js                  # Express API server entry point
│
├── frontend/                      # React 19 + TypeScript + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/            # Reusable UI widgets & Leaflet LiveMap
│   │   ├── context/               # AuthContext & 1-click role switcher
│   │   ├── pages/                 # Role-based dashboards & tracking views
│   │   ├── services/              # Unified API client & resilient demo fallback
│   │   ├── types/                 # TypeScript data contracts
│   │   ├── App.tsx                # App routing & protected layout
│   │   ├── index.css              # Design tokens & glassmorphism styles
│   │   └── main.tsx               # Client entry point
│   ├── index.html
│   ├── package.json               # Frontend dependencies
│   ├── tailwind.config.js         # Tailwind configuration
│   └── vite.config.ts             # Vite configuration with /api proxy
│
└── package.json                   # Root orchestrator with unified scripts
```

---

## 🚀 Quick Start & How to Run

### 1. Install Dependencies
You can install all dependencies from the root directory:
```bash
npm run install:all
```
Or individually:
```bash
# In backend/
cd backend && npm install

# In frontend/
cd frontend && npm install
```

### 2. Initialize Database & Seed (MySQL)
Configure `backend/.env` with your MySQL credentials, then run:
```bash
npm run init-db
npm run seed
```

### 3. Run Backend & Frontend Servers
- **Start Backend API (Port 5000):**
  ```bash
  npm run start:backend
  ```
- **Start Frontend App (Port 5173):**
  ```bash
  npm run start:frontend
  ```

---

## 🔑 Demo Evaluation Accounts

| Role | Demo Email | Password | Access Highlights |
| :--- | :--- | :--- | :--- |
| **Transport Admin** | `admin@nprcolleges.org` | `password123` | Full fleet command, telematics, route orchestration |
| **Bus Mentor** | `mentor.pandi@nprcolleges.org` | `password123` | Student boarding roll call, manifest check-in |
| **Bus Driver** | `driver.saravanan@nprcolleges.org` | `password123` | Cockpit speedometer, live GPS waypoint simulator |
| **Gate Security** | `watchman.kandasamy@nprcolleges.org` | `password123` | Fast QR scanner, gate entry/exit logging |
| **Student** | `sabari.mca@nprcolleges.org` | `password123` | Digital Pass with QR, live ETA & bus location |
