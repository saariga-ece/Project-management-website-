require('dotenv').config();
const mysql = require('mysql2/promise');

(async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
  });

  const dbName = process.env.DB_NAME || 'project_management';
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
  await connection.query(`USE \`${dbName}\`;`);
  await connection.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(180) NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
    CREATE TABLE IF NOT EXISTS tasks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      project_id INT NOT NULL,
      title VARCHAR(220) NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      assignee VARCHAR(120) NOT NULL DEFAULT '',
      due_date DATE NULL,
      priority ENUM('Low','Medium','High') NOT NULL DEFAULT 'Medium',
      status ENUM('Backlog','To Do','In Progress','Review','Done') NOT NULL DEFAULT 'Backlog',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;
  `);

  await connection.query(`USE \`${dbName}\`;`);
  await connection.query('DELETE FROM tasks');
  await connection.query('DELETE FROM projects');

  const projectData = [
    ['Launch website redesign', 'Deliver a faster customer experience with a new branding and homepage flow.'],
    ['Mobile app MVP', 'Build and test core mobile workflows for early adopters.'],
    ['Operations improvements', 'Automate reports and reduce manual handoffs across teams.'],
  ];

  await connection.query('INSERT INTO projects (name, description) VALUES ?;', [projectData]);
  const [projects] = await connection.query('SELECT id FROM projects ORDER BY id');

  const tasks = [
    [projects[0].id, 'Map homepage user journeys', 'Define the new homepage conversion path and handoff to design.', 'Laura', '2026-06-14', 'High', 'To Do'],
    [projects[0].id, 'Finalize content audit', 'Audit every page and align with SEO guidelines.', 'Silas', '2026-06-18', 'Medium', 'Review'],
    [projects[1].id, 'Build authentication screen', 'Implement signup, login and password reset.', 'Danielle', '2026-06-10', 'High', 'In Progress'],
    [projects[1].id, 'Configure push notifications', 'Add notifications for key product events.', 'Mira', '2026-06-20', 'Medium', 'Backlog'],
    [projects[2].id, 'Create weekly report template', 'Standardize the operations report format.', 'Nina', '2026-06-08', 'Low', 'Done'],
    [projects[2].id, 'Deploy automated alerts', 'Notify stakeholders when inventory thresholds are exceeded.', 'Omar', '2026-06-12', 'High', 'In Progress'],
  ];

  await connection.query('INSERT INTO tasks (project_id, title, description, assignee, due_date, priority, status) VALUES ?;', [tasks]);

  console.log('Seed data loaded successfully.');
  await connection.end();
})();
