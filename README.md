# Fullstack Project Management Tool

This repository contains a complete Jira-inspired project management tool built with:

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MySQL

## Setup

1. Install the backend dependencies:
   ```bash
   cd server
   npm install
   ```

2. Install the frontend dependencies:
   ```bash
   cd ../client
   npm install
   ```

3. Ensure MySQL is running locally and that the credentials in `server/.env` are correct.

4. Seed the database:
   ```bash
   cd ../server
   npm run seed
   ```

5. Start the backend API:
   ```bash
   npm run dev
   ```

6. Start the frontend app:
   ```bash
   cd ../client
   npm run dev
   ```

7. Open the app in your browser at `http://localhost:5173`.
