# GAG Mind Training Game Platform & CMS Suite

A complete, full-stack mind training educational portal and game management CMS suite featuring 48 interactive cognitive training games, live quiz session engines, real-time question synchronization, and a developer-accessible MySQL administration dashboard.

---

## 🏗️ Architecture Overview

The repository is structured as a high-performance **npm workspace monorepo**:

* **pps/web** (Port: 3000):
  * **Framework**: Next.js (App/Pages Router) + Tailwind CSS.
  * **Role**: The main student/user portal, dashboard, cognitive profile, and interactive game viewports. It also acts as a reverse proxy, routing /admin/* traffic directly to the Admin Dashboard.
* **pps/gamecenter-admin** (Port: 3001):
  * **Framework**: Next.js App Router + Tailwind CSS + Shadcn UI.
  * **Role**: The modern, primary CMS Admin Dashboard. Runs locally on port 3001 but is seamlessly integrated into the main web portal via the http://localhost:3000/admin route proxy.
* **pps/admin/backend** (Port: 5000):
  * **Framework**: Express.js + Prisma ORM + MySQL.
  * **Role**: High-speed REST API for game questions, bulk upload parsers (CSV/Word), CORS access controls, and game session state engines.
* **pps/admin/frontend** (Port: 5173):
  * **Framework**: Vite + React 18 + Tailwind CSS.
  * **Role**: Legacy CMS dashboard. Superseded by gamecenter-admin.

---

## ⚙️ Prerequisites

Make sure the following are installed on the host machine:

1. **Node.js**: 18.x or 20.x (LTS recommended)
2. **npm**: 9.x or 10.x
3. **MySQL Server**: 8.0+ (Local MySQL or any remote cloud MySQL URL such as AWS RDS, Railway, DigitalOcean, etc.)

---

## 🚀 Quick Start Guide (Run in 3 Steps)

### 1. Install Dependencies
Open a terminal in the root directory and run:
`ash
npm run install:all
`

### 2. Configure Environment & Database
* Navigate to **pps/admin/backend/.env** and configure your MySQL connection string:
  `env
  DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/gamecenter"
  `
  *(Replace YOUR_PASSWORD with your local or cloud MySQL password)*

* Push the database schema (creates the database and all tables automatically):
  `ash
  npm run db:push:admin
  `

### 3. Start the Project
Run the single unified development command from the root folder:
`ash
npm run dev
`

All services will start concurrently in development mode:
* **Web Portal**: [http://localhost:3000](http://localhost:3000)
* **Master Admin Panel**: [http://localhost:3000/admin](http://localhost:3000/admin) *(proxies securely to the underlying gamecenter-admin on port 3001)*
* **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## 🔑 Default Credentials & Access Points

| Service | URL | Default Credentials | Description |
| :--- | :--- | :--- | :--- |
| **Main Portal** | http://localhost:3000 | Sign-up / Login on site | Public game training portal |
| **Admin Panel (Proxy)** | http://localhost:3000/admin | dmin@gamecenter.com / dmin123 | Seamlessly integrated admin access |
| **Admin Panel (Direct)** | http://localhost:3001/admin | dmin@gamecenter.com / dmin123 | Direct port 3001 access if proxy is bypassed |
| **Admin Backend API** | http://localhost:5000 | API Token (Bearer) | Public & protected REST endpoints |

> **Note**: On the very first startup, the backend will automatically seed the Super Admin account and synchronize all **48 game categories and starter question banks** into your MySQL database.

---

## 📦 Ready-to-Send Checklist for Teams

When sending this project folder as a ZIP file or pushing to git:

1. **Delete build and dependency folders** to keep the ZIP lightweight:
   * 
ode_modules/ (in root and all apps)
   * .next/ (in Next.js apps)
   * dist/ (in Vite apps)
2. **Include .env files** (or ensure .env.example is populated).
3. The recipient simply runs:
   `ash
   npm run install:all
   npm run db:push:admin
   npm run dev
   `

---

## 💻 Handy Commands

| Command | Action |
| :--- | :--- |
| 
pm run dev | Starts all web and admin services together |
| 
pm run dev:web | Starts only the Next.js web portal |
| 
pm run dev:admin | Starts only the Admin API and Admin UIs |
| 
pm run db:push:admin | Pushes Prisma schema changes to MySQL |
| 
pm run db:studio:admin | Opens Prisma Studio GUI to inspect/edit MySQL tables visually |
| 
pm run build | Compiles production bundles for all apps |