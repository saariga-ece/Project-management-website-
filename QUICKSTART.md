# JiraLite - Fullstack Project Management Tool

A complete Jira-inspired project management application built with React, Node.js/Express, and MySQL.

## Architecture

### Frontend
- **React 19** + Vite for a fast, modern development experience
- **React Router** for navigation between Dashboard and Board views
- **Axios** for API communication
- Responsive design with custom CSS and a blue/white color scheme

### Backend
- **Node.js** + **Express 5** REST API
- CORS-enabled for localhost:5173 (React dev server)
- MySQL connection pooling with `mysql2/promise`
- Environment-based configuration via `.env`

### Database
- **MySQL** with two core tables: `projects` and `tasks`
- Foreign key relationships with cascade delete
- Tasks have: title, description, assignee, due date, priority (Low/Medium/High), status (Backlog → Done)

## Quick Setup

### Prerequisites
- Node.js 16+ installed
- MySQL 5.7+ running locally on port 3306
- Default root user with empty password (or adjust `.env`)

### 1. Install Dependencies

```bash
cd server
npm install

cd ../client
npm install
```

### 2. Seed the Database

```bash
cd server
npm run seed
```

This will:
- Create the `project_management` database
- Create `projects` and `tasks` tables
- Insert 3 sample projects and 6 sample tasks

### 3. Start the Backend

```bash
cd server
npm run dev
```

Expected output:
```
Server running on http://localhost:4000
```

### 4. Start the Frontend (in a new terminal)

```bash
cd client
npm run dev
```

Expected output:
```
  VITE v8.0.12  ready in XXX ms

  ➜  Local:   http://localhost:5173/
```

### 5. Open the App

Navigate to **http://localhost:5173** in your browser.

---

## Features

### Dashboard (`/`)
- Overview of all projects and tasks
- KPI cards showing:
  - Number of active projects
  - Total tasks
  - Task count by status
- Create new projects with a form
- View existing projects and task counts
- Delete projects (removes all associated tasks)

### Board (`/board`)
- Kanban view organized by task status: Backlog → To Do → In Progress → Review → Done
- Select a project from the dropdown
- Create new tasks for the selected project
- Edit tasks with modal dialog
- Move tasks between columns using arrow buttons
- Delete tasks
- See assignee, due date, and priority for each task

---

## API Endpoints

All endpoints are prefixed with `/api`.

### Projects
- `GET /projects` - List all projects
- `POST /projects` - Create a project
- `PUT /projects/:id` - Update a project
- `DELETE /projects/:id` - Delete a project (cascades tasks)

### Tasks
- `GET /tasks` - List all tasks (ordered by status)
- `GET /tasks/project/:projectId` - List tasks for a specific project
- `POST /tasks` - Create a task
- `PUT /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task

---

## File Structure

```
fullstack-management/
├── client/                          # React frontend
│   ├── src/
│   │   ├── App.jsx                 # Main app with routing
│   │   ├── App.css                 # Navigation styles
│   │   ├── main.jsx                # React DOM root
│   │   ├── index.css               # Global styles
│   │   ├── api/
│   │   │   └── api.js              # Axios HTTP client
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx       # Overview page
│   │   │   ├── Dashboard.css
│   │   │   ├── Board.jsx           # Kanban board page
│   │   │   └── Board.css
│   │   └── components/
│   │       ├── ProjectCard.jsx     # Project card in dashboard
│   │       ├── ProjectCard.css
│   │       ├── KanbanColumn.jsx    # Status column on board
│   │       ├── KanbanColumn.css
│   │       ├── TaskCard.jsx        # Individual task card
│   │       ├── TaskCard.css
│   │       ├── TaskModal.jsx       # Create/edit modal
│   │       └── TaskModal.css
│   ├── index.html                  # HTML entry point
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
├── server/                          # Node.js/Express backend
│   ├── index.js                    # Express app entry
│   ├── db.js                       # MySQL connection pool
│   ├── routes/
│   │   ├── project.js              # Project CRUD routes
│   │   └── task.js                 # Task CRUD routes
│   ├── schema.sql                  # Database schema (reference)
│   ├── seed.js                     # Database seeding script
│   ├── .env                        # Environment configuration
│   ├── package.json
│   └── README.md
│
├── README.md                        # Main project documentation
├── QUICKSTART.md                    # This file
└── .gitignore
```

---

## Environment Configuration

The backend reads from `server/.env`:

```env
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=
DB_NAME=project_management
PORT=4000
```

Adjust credentials to match your MySQL setup.

---

## Sample Data

After seeding, the database contains:

### Projects
1. **Launch website redesign** - "Deliver a faster customer experience..."
2. **Mobile app MVP** - "Build and test core mobile workflows..."
3. **Operations improvements** - "Automate reports and reduce manual handoffs..."

### Tasks
- 6 sample tasks distributed across projects
- Assigned to team members (Laura, Silas, Danielle, Mira, Nina, Omar)
- Due dates ranging from June 8–20, 2026
- Mix of priorities and statuses

---

## Development Notes

### Frontend Build
```bash
npm run build     # Production bundle
npm run preview   # Preview production build
npm run lint      # ESLint checks
```

### Backend Scripts
```bash
npm run dev       # Start with Nodemon (hot reload)
npm start         # Start production server
npm run seed      # Initialize/reset database
```

### Debugging
- React DevTools recommended for component inspection
- Browser console will log API errors
- Backend logs errors to the console

---

## Customization

### Add a New Status
Edit `STATUSES` array in `client/src/pages/Board.jsx` and add to the MySQL `ENUM` in `server/seed.js`.

### Add a New Priority
Add options to the priority select in `client/src/components/TaskModal.jsx` and update the database ENUM.

### Change the API Port
Update `PORT` in `server/.env` and `baseURL` in `client/src/api/api.js`.

### Adjust Styling
All CSS files are modular (one per component). Colors use a palette:
- Primary blue: `#2563eb`
- Light backgrounds: `#f8fafc`, `#ffffff`
- Text: `#0f172a`, `#475569`

---

## Troubleshooting

### "Cannot find module 'express'"
Run `npm install` in the server directory.

### "Failed to connect to MySQL"
- Ensure MySQL is running locally
- Verify credentials in `server/.env`
- Check that `project_management` database exists (run `npm run seed`)

### "Port 4000 already in use"
Change `PORT` in `.env` or kill the existing process:
```bash
lsof -i :4000  # macOS/Linux
Get-Process -Id (Get-NetTCPConnection -LocalPort 4000).OwningProcess  # Windows
```

### VITE app won't load
Ensure backend is running on port 4000 and the React app is on 5173.

---

## Production Deployment

To deploy this app:

1. **Frontend**: Build with `npm run build`, serve the `dist/` folder with a static hosting service or web server
2. **Backend**: Run `npm start` on a Node.js-capable server
3. **Database**: Set up MySQL with the schema from `server/schema.sql`
4. **Environment**: Update `.env` with production database credentials and API URL

---

**Enjoy managing your projects with JiraLite!**
