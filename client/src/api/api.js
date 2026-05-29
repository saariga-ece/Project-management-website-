import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  timeout: 8000,
});

export function getProjects() {
  return api.get('/projects').then((res) => res.data);
}

export function createProject(project) {
  return api.post('/projects', project).then((res) => res.data);
}

export function updateProject(projectId, changes) {
  return api.put(`/projects/${projectId}`, changes).then((res) => res.data);
}

export function deleteProject(projectId) {
  return api.delete(`/projects/${projectId}`).then((res) => res.data);
}

export function getAllTasks() {
  return api.get('/tasks').then((res) => res.data);
}

export function getProjectTasks(projectId) {
  return api.get(`/tasks/project/${projectId}`).then((res) => res.data);
}

export function createTask(task) {
  return api.post('/tasks', task).then((res) => res.data);
}

export function updateTask(taskId, changes) {
  return api.put(`/tasks/${taskId}`, changes).then((res) => res.data);
}

export function deleteTask(taskId) {
  return api.delete(`/tasks/${taskId}`).then((res) => res.data);
}
