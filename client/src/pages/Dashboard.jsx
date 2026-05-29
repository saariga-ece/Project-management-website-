import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  createProject,
  deleteProject,
  getAllTasks,
  getProjects,
  updateProject,
} from '../api/api.js';

import ProjectCard from '../components/ProjectCard.jsx';

import './Dashboard.css';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

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
      setError('Unable to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }

  const projectStats = useMemo(
    () =>
      projects.map((project) => {
        const projectTasks = tasks.filter(
          (task) => task.project_id === project.id
        );

        const doneTasks = projectTasks.filter(
          (task) => task.status === 'Done'
        ).length;

        const totalTasks = projectTasks.length;

        return {
          id: project.id,
          doneTasks,
          totalTasks,
          progress: totalTasks
            ? Math.round((doneTasks / totalTasks) * 100)
            : 0,
        };
      }),
    [projects, tasks]
  );

  async function handleCreateProject(event) {
    event.preventDefault();

    if (!newProjectName.trim()) {
      setError('Project name is required.');
      return;
    }

    try {
      setError('');

      await createProject({
        name: newProjectName.trim(),
        description: newProjectDescription.trim(),
      });

      setNewProjectName('');
      setNewProjectDescription('');

      await fetchData();
    } catch (err) {
      setError('Unable to create project.');
    }
  }

  async function handleRenameProject(projectId, name) {
    if (!name.trim()) {
      setError('Project name cannot be empty.');
      return;
    }

    try {
      setError('');

      const project = projects.find((item) => item.id === projectId);

      await updateProject(projectId, {
        name: name.trim(),
        description: project.description || '',
      });

      await fetchData();
    } catch (err) {
      setError('Unable to rename project.');
    }
  }

  async function handleRemoveProject(projectId) {
    if (!window.confirm('Delete this project and all its tasks?')) {
      return;
    }

    try {
      setError('');

      await deleteProject(projectId);

      await fetchData();
    } catch (err) {
      setError('Unable to delete project.');
    }
  }

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === 'Done'
  ).length;

  return (
    <div className="dashboard-page">
      {/* HERO SECTION */}

      <section className="dashboard-hero">
        <div>
          <p className="hero-subtitle">PROJECT MANAGEMENT</p>

          <h1 className="hero-title">
            Manage all your projects in one place
          </h1>

          <p className="hero-text">
            Organize tasks, track progress, and collaborate efficiently.
          </p>
        </div>

        <Link to="/board" className="hero-button">
          <i className="bi bi-kanban-fill"></i>
          Open Board
        </Link>
      </section>

      {/* STATS */}

      <section className="stats-grid">
        <div className="stats-card">
          <div className="stats-icon blue">
            <i className="bi bi-folder-fill"></i>
          </div>

          <div>
            <p>Total Projects</p>
            <h3>{projects.length}</h3>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-icon purple">
            <i className="bi bi-list-task"></i>
          </div>

          <div>
            <p>Total Tasks</p>
            <h3>{totalTasks}</h3>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-icon green">
            <i className="bi bi-check-circle-fill"></i>
          </div>

          <div>
            <p>Completed</p>
            <h3>{completedTasks}</h3>
          </div>
        </div>
      </section>

      {/* PROJECTS */}

      <section className="projects-section">
        <div className="section-header">
          <div>
            <p className="hero-subtitle">PROJECTS</p>
            <h2>Your Workspace</h2>
          </div>
        </div>

        <div className="projects-grid">
          {projects.map((project) => {
            const stats = projectStats.find(
              (item) => item.id === project.id
            ) || {
              progress: 0,
              totalTasks: 0,
              doneTasks: 0,
            };

            return (
              <ProjectCard
                key={project.id}
                project={project}
                doneCount={stats.doneTasks}
                totalCount={stats.totalTasks}
                progress={stats.progress}
                onRename={handleRenameProject}
                onDelete={() => handleRemoveProject(project.id)}
              />
            );
          })}
        </div>
      </section>

      {/* CREATE PROJECT */}

      <section className="create-project-card">
        <div className="section-header">
          <div>
            <p className="hero-subtitle">NEW PROJECT</p>
            <h2>Create Project</h2>
          </div>
        </div>

        <form className="create-project-form" onSubmit={handleCreateProject}>
          {error && <div className="form-error">{error}</div>}

          <input
            type="text"
            placeholder="Project name"
            value={newProjectName}
            onChange={(event) => setNewProjectName(event.target.value)}
          />

          <textarea
            rows="4"
            placeholder="Project description"
            value={newProjectDescription}
            onChange={(event) =>
              setNewProjectDescription(event.target.value)
            }
          />

          <button type="submit" className="create-button">
            <i className="bi bi-plus-circle-fill"></i>
            Create Project
          </button>
        </form>
      </section>

      {/* LOADING */}

      {loading && (
        <div className="loading-overlay">
          <div className="spinner-border text-primary"></div>
        </div>
      )}
    </div>
  );
}