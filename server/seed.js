const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DB_URI || process.env.DATABASE_URL;
const poolConfig = connectionString
  ? { connectionString }
  : {
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'project_management',
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    };

const pool = new Pool(poolConfig);

async function ensureSchema() {
  await pool.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_priority') THEN
        CREATE TYPE task_priority AS ENUM ('Low', 'Medium', 'High');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_status') THEN
        CREATE TYPE task_status AS ENUM ('Backlog', 'To Do', 'In Progress', 'Review', 'Done');
      END IF;
    END$$;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      name VARCHAR(180) NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      title VARCHAR(220) NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      assignee VARCHAR(120) NOT NULL DEFAULT '',
      due_date DATE,
      priority task_priority NOT NULL DEFAULT 'Medium',
      status task_status NOT NULL DEFAULT 'Backlog',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

(async function seed() {
  try {
    await ensureSchema();
    await pool.query('TRUNCATE TABLE tasks, projects RESTART IDENTITY CASCADE;');

    const projectData = [
      ['Launch website redesign', 'Deliver a faster customer experience with a new branding and homepage flow.'],
      ['Mobile app MVP', 'Build and test core mobile workflows for early adopters.'],
      ['Operations improvements', 'Automate reports and reduce manual handoffs across teams.'],
    ];

    const projectIds = [];
    for (const [name, description] of projectData) {
      const result = await pool.query(
        'INSERT INTO projects (name, description) VALUES ($1, $2) RETURNING id',
        [name, description]
      );
      projectIds.push(result.rows[0].id);
    }

    const tasks = [
      { projectId: projectIds[0], title: 'Map homepage user journeys', description: 'Define the new homepage conversion path and handoff to design.', assignee: 'Laura', dueDate: '2026-06-14', priority: 'High', status: 'To Do' },
      { projectId: projectIds[0], title: 'Finalize content audit', description: 'Audit every page and align with SEO guidelines.', assignee: 'Silas', dueDate: '2026-06-18', priority: 'Medium', status: 'Review' },
      { projectId: projectIds[1], title: 'Build authentication screen', description: 'Implement signup, login and password reset.', assignee: 'Danielle', dueDate: '2026-06-10', priority: 'High', status: 'In Progress' },
      { projectId: projectIds[1], title: 'Configure push notifications', description: 'Add notifications for key product events.', assignee: 'Mira', dueDate: '2026-06-20', priority: 'Medium', status: 'Backlog' },
      { projectId: projectIds[2], title: 'Create weekly report template', description: 'Standardize the operations report format.', assignee: 'Nina', dueDate: '2026-06-08', priority: 'Low', status: 'Done' },
      { projectId: projectIds[2], title: 'Deploy automated alerts', description: 'Notify stakeholders when inventory thresholds are exceeded.', assignee: 'Omar', dueDate: '2026-06-12', priority: 'High', status: 'In Progress' },
    ];

    for (const task of tasks) {
      await pool.query(
        `INSERT INTO tasks (project_id, title, description, assignee, due_date, priority, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [task.projectId, task.title, task.description, task.assignee, task.dueDate, task.priority, task.status]
      );
    }

    console.log('Seed data loaded successfully.');
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();
