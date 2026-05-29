import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  createTask,
  deleteTask,
  getAllTasks,
  getProjects,
  updateTask,
} from '../api/api.js';

import KanbanColumn from '../components/KanbanColumn.jsx';
import TaskModal from '../components/TaskModal.jsx';

import './Board.css';

const STATUSES = ['To Do', 'In Progress', 'Done'];

export default function Board() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const [activeTask, setActiveTask] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');

  const [dragOverStatus, setDragOverStatus] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedProjectId && projects.length > 0) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  async function fetchData() {
    try {
      setLoading(true);

      const [projectData, taskData] = await Promise.all([
        getProjects(),
        getAllTasks(),
      ]);

      setProjects(projectData);
      setTasks(taskData);
    } catch (err) {
      setError('Unable to load board data.');
    } finally {
      setLoading(false);
    }
  }

  const selectedProject = useMemo(
    () =>
      projects.find(
        (project) => project.id === selectedProjectId
      ) || projects[0] || null,
    [projects, selectedProjectId]
  );

  const projectTasks = useMemo(() => {
    if (!selectedProject) {
      return [];
    }

    return tasks.filter(
      (task) => task.project_id === selectedProject.id
    );
  }, [tasks, selectedProject]);

  const buckets = useMemo(
    () =>
      STATUSES.map((status) => ({
        status,
        items: projectTasks.filter(
          (task) => task.status === status
        ),
      })),
    [projectTasks]
  );

  async function handleSaveTask(task) {
    try {
      setError('');

      if (task.id) {
        await updateTask(task.id, task);
      } else {
        await createTask(task);
      }

      setModalOpen(false);

      setActiveTask(null);

      await fetchData();
    } catch (err) {
      setError('Unable to save task.');
    }
  }

  async function handleDropTask(taskId, status) {
    const task = tasks.find(
      (item) => item.id === Number(taskId)
    );

    if (!task || task.status === status) {
      setDragOverStatus(null);
      return;
    }

    try {
      await updateTask(task.id, {
        ...task,
        status,
      });

      await fetchData();
    } catch (err) {
      setError('Unable to update task status.');
    } finally {
      setDragOverStatus(null);
    }
  }

  async function handleRemoveTask(taskId) {
    if (!window.confirm('Delete this task?')) {
      return;
    }

    try {
      await deleteTask(taskId);

      await fetchData();
    } catch (err) {
      setError('Unable to delete task.');
    }
  }

  function openNewTask() {
    if (!selectedProject) {
      return;
    }

    setActiveTask({
      project_id: selectedProject.id,
      title: '',
      description: '',
      assignee: '',
      priority: 'Medium',
      status: 'To Do',
    });

    setModalOpen(true);
  }

  function openEditTask(task) {
    setActiveTask(task);

    setModalOpen(true);
  }

  return (
    <div className="board-page">
      {/* TOPBAR */}

      <section className="board-header">
        <div>
          <p className="board-subtitle">KANBAN BOARD</p>

          <h1 className="board-title">
            {selectedProject
              ? selectedProject.name
              : 'Project Board'}
          </h1>

          <p className="board-text">
            Drag and drop tasks between columns to update
            progress instantly.
          </p>
        </div>

        <div className="board-actions">
          <select
            value={selectedProjectId || ''}
            onChange={(e) =>
              setSelectedProjectId(Number(e.target.value))
            }
            className="project-select"
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>

          <button
            className="new-task-btn"
            onClick={openNewTask}
          >
            <i className="bi bi-plus-circle-fill"></i>
            Add Task
          </button>
        </div>
      </section>

      {/* BOARD */}

      <section className="board-grid">
        {buckets.map((bucket) => (
          <KanbanColumn
            key={bucket.status}
            status={bucket.status}
            tasks={bucket.items}
            onEdit={openEditTask}
            onDelete={handleRemoveTask}
            onDrop={handleDropTask}
            onDragOver={() =>
              setDragOverStatus(bucket.status)
            }
            onDragLeave={() => setDragOverStatus(null)}
            activeDrop={dragOverStatus === bucket.status}
          />
        ))}
      </section>

      {/* ERROR */}

      {error && (
        <div className="form-error">{error}</div>
      )}

      {/* MODAL */}

      <TaskModal
        open={modalOpen}
        task={activeTask}
        onClose={() => {
          setModalOpen(false);
          setActiveTask(null);
        }}
        onSave={handleSaveTask}
      />

      {/* LOADING */}

      {loading && (
        <div className="loading-overlay">
          <div className="spinner-border text-primary"></div>
        </div>
      )}
    </div>
  );
}