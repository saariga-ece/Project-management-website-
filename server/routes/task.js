const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const [tasks] = await db.query(
      `SELECT t.*, p.name AS project_name
       FROM tasks t
       LEFT JOIN projects p ON p.id = t.project_id
       ORDER BY FIELD(t.status, 'Backlog', 'To Do', 'In Progress', 'Review', 'Done'), t.due_date IS NULL, t.due_date ASC`
    );
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

router.get('/project/:projectId', async (req, res, next) => {
  try {
    const projectId = Number(req.params.projectId);
    const [tasks] = await db.query(
      `SELECT t.*, p.name AS project_name
      FROM tasks t
      LEFT JOIN projects p ON p.id = t.project_id
      WHERE t.project_id = ?
      ORDER BY FIELD(t.status, 'Backlog', 'To Do', 'In Progress', 'Review', 'Done'), t.due_date IS NULL, t.due_date ASC`,
      [projectId]
    );
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { project_id, title, description, assignee, due_date, priority, status } = req.body;
    if (!project_id || !title) {
      return res.status(400).json({ error: 'Project and title are required.' });
    }
    const [result] = await db.query(
      `INSERT INTO tasks (project_id, title, description, assignee, due_date, priority, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [project_id, title.trim(), description || '', assignee || '', due_date || null, priority || 'Medium', status || 'Backlog']
    );
    const [rows] = await db.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const taskId = Number(req.params.id);
    const { project_id, title, description, assignee, due_date, priority, status } = req.body;
    if (!project_id || !title) {
      return res.status(400).json({ error: 'Project and title are required.' });
    }
    await db.query(
      `UPDATE tasks SET project_id = ?, title = ?, description = ?, assignee = ?, due_date = ?, priority = ?, status = ? WHERE id = ?`,
      [project_id, title.trim(), description || '', assignee || '', due_date || null, priority || 'Medium', status || 'Backlog', taskId]
    );
    const [rows] = await db.query('SELECT * FROM tasks WHERE id = ?', [taskId]);
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const taskId = Number(req.params.id);
    await db.query('DELETE FROM tasks WHERE id = ?', [taskId]);
    res.json({ deleted: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
