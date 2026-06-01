DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_priority') THEN
    CREATE TYPE task_priority AS ENUM ('Low', 'Medium', 'High');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_status') THEN
    CREATE TYPE task_status AS ENUM ('Backlog', 'To Do', 'In Progress', 'Review', 'Done');
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

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
