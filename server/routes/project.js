const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const [projects] = await db.query(
      `SELECT p.id, p.name, p.description, p.created_at,
        COUNT(t.id) AS task_count
      FROM projects p
      LEFT JOIN tasks t ON t.project_id = p.id
      GROUP BY p.id
      ORDER BY p.created_at DESC`
    );
    res.json(projects);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Project name is required.' });
    }
    const [result] = await db.query(
      'INSERT INTO projects (name, description) VALUES (?, ?)',
      [name.trim(), description || '']
    );
    const [rows] = await db.query('SELECT * FROM projects WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const projectId = Number(req.params.id);
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Project name is required.' });
    }
    await db.query('UPDATE projects SET name = ?, description = ? WHERE id = ?', [name.trim(), description || '', projectId]);
    const [rows] = await db.query('SELECT * FROM projects WHERE id = ?', [projectId]);
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const projectId = Number(req.params.id);
    await db.query('DELETE FROM tasks WHERE project_id = ?', [projectId]);
    await db.query('DELETE FROM projects WHERE id = ?', [projectId]);
    res.json({ deleted: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
