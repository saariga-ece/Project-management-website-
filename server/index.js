require('dotenv').config();
const express = require('express');
const cors = require('cors');
const projectRoutes = require('./routes/project');
const taskRoutes = require('./routes/task');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'project-management-api' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
