CREATE DATABASE IF NOT EXISTS project_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE project_management;

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
