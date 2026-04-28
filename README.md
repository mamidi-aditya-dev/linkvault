# 🔗 LinkVault — Full-Stack Link Manager

A full-stack web application to save, organize, and playlist your favourite links.
Built with **React + Vite** (frontend) and **Node.js + Express + SQLite** (backend).

---

## 🗂 Project Structure

```
linkvault/
├── package.json              ← root runner (concurrently)
│
├── backend/
│   ├── server.js             ← Express entry point
│   ├── db.js                 ← sql.js SQLite (pure JS, no install needed)
│   ├── .env                  ← PORT, JWT_SECRET, DB_PATH
│   ├── middleware/
│   │   └── auth.js           ← JWT auth guard
│   └── routes/
│       ├── auth.js           ← /api/auth  (register, login, me)
│       ├── links.js          ← /api/links (CRUD + search/filter)
│       └── playlists.js      ← /api/playlists (CRUD)
│
└── frontend/
    ├── vite.config.js        ← Vite + proxy to :5000
    ├── index.html
    └── src/
        ├── main.jsx          ← entry, BrowserRouter, auth guard
        ├── App.jsx           ← layout, global state, handlers
        ├── api.js            ← Axios with JWT interceptor
        ├── constants.js      ← known sources, colors, helpers
        ├── index.css         ← global dark theme
        ├── context/
        │   ├── AuthContext.jsx    ← login/register/logout state
        │   └── ToastContext.jsx   ← global toast notifications
        ├── components/
        │   ├── Sidebar.jsx        ← navigation sidebar
        │   ├── LinkCard.jsx       ← single link card
        │   ├── LinksGrid.jsx      ← responsive links grid
        │   ├── LinkModal.jsx      ← add/edit link form
        │   └── PlaylistModal.jsx  ← add/edit playlist form
        └── pages/
            ├── AuthPage.jsx       ← login + register (tabbed)
            ├── AllLinksPage.jsx   ← main dashboard with filters
            ├── PlaylistsPage.jsx  ← playlist grid
            └── OtherPages.jsx     ← playlist detail, source detail, recent
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (https://nodejs.org)

### 1. Install dependencies

```bash
cd linkvault

# Install root runner
npm install

# Install backend + frontend
cd backend && npm install && cd ../frontend && npm install && cd ..
```

### 2. Configure environment (optional)

Edit `backend/.env`:
```env
PORT=5000
JWT_SECRET=change_this_to_something_secret_in_production
DB_PATH=./linkvault.db
```

### 3. Run both servers

```bash
npm run dev
```

- **Frontend** → http://localhost:3000
- **Backend API** → http://localhost:5000/api

Or run them separately:
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

---

## 🔌 API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, get JWT |
| GET  | `/api/auth/me` | Get current user |

### Links (all protected)
| Method | Route | Description |
|--------|-------|-------------|
| GET    | `/api/links` | Get all links (supports `?source=`, `?type=`, `?search=`) |
| GET    | `/api/links/stats` | Source/type breakdown counts |
| POST   | `/api/links` | Create link |
| PUT    | `/api/links/:id` | Update link |
| DELETE | `/api/links/:id` | Delete link |

### Playlists (all protected)
| Method | Route | Description |
|--------|-------|-------------|
| GET    | `/api/playlists` | Get all playlists with link counts |
| GET    | `/api/playlists/:id/links` | Get playlist + its links |
| POST   | `/api/playlists` | Create playlist |
| PUT    | `/api/playlists/:id` | Update playlist |
| DELETE | `/api/playlists/:id` | Delete playlist |

---

## ✅ Features

- 🔐 **Auth** — JWT-based login/register, bcrypt passwords
- 🗂 **All Links** — View, search, filter by source or category
- 🎵 **Playlists** — Themed collections with emoji + color
- 🌐 **Sources** — Google, YouTube, Twitter, LinkedIn, GitHub + custom
- 🏷 **Categories** — Jobs, Music, Recipe, Tutorial, News, etc.
- 🗑 **CRUD** — Add, edit, delete links and playlists
- 💾 **SQLite** — Data persists in a local `.db` file
- 📱 **Responsive** — Works on desktop and mobile
- 🔔 **Toast notifications** — Success/error feedback

---

## 🏗 Build for Production

```bash
cd frontend && npm run build
```

Serve the `frontend/dist/` folder with any static host (Netlify, Vercel, Nginx).
Point your backend to the same domain or configure CORS in `backend/.env`:
```env
CLIENT_URL=https://yourdomain.com
```
