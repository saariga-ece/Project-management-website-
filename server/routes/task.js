const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT t.*, p.name AS project_name
       FROM tasks t
       LEFT JOIN projects p ON p.id = t.project_id
       ORDER BY
         CASE t.status
           WHEN 'Backlog' THEN 1
           WHEN 'To Do' THEN 2
           WHEN 'In Progress' THEN 3
           WHEN 'Review' THEN 4
           WHEN 'Done' THEN 5
           ELSE 6
         END,
         t.due_date IS NULL,
         t.due_date ASC`
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.get('/project/:projectId', async (req, res, next) => {
  try {
    const projectId = Number(req.params.projectId);
    const { rows } = await db.query(
      `SELECT t.*, p.name AS project_name
       FROM tasks t
       LEFT JOIN projects p ON p.id = t.project_id
       WHERE t.project_id = $1
       ORDER BY
         CASE t.status
           WHEN 'Backlog' THEN 1
           WHEN 'To Do' THEN 2
           WHEN 'In Progress' THEN 3
           WHEN 'Review' THEN 4
           WHEN 'Done' THEN 5
           ELSE 6
         END,
         t.due_date IS NULL,
         t.due_date ASC`,
      [projectId]
    );
    res.json(rows);
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
    const { rows } = await db.query(
      `INSERT INTO tasks (project_id, title, description, assignee, due_date, priority, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [project_id, title.trim(), description || '', assignee || '', due_date || null, priority || 'Medium', status || 'Backlog']
    );
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
    const { rows } = await db.query(
      `UPDATE tasks
       SET project_id = $1,
           title = $2,
           description = $3,
           assignee = $4,
           due_date = $5,
           priority = $6,
           status = $7
       WHERE id = $8
       RETURNING *`,
      [project_id, title.trim(), description || '', assignee || '', due_date || null, priority || 'Medium', status || 'Backlog', taskId]
    );
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const taskId = Number(req.params.id);
    await db.query('DELETE FROM tasks WHERE id = $1', [taskId]);
    res.json({ deleted: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
