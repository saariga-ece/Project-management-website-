import { NavLink } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <i className="bi bi-kanban-fill"></i>
        <span>ManageTasks</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? 'sidebar-link active' : 'sidebar-link'
          }
        >
          <i className="bi bi-grid-fill"></i>
          Dashboard
        </NavLink>

        <NavLink
          to="/board"
          className={({ isActive }) =>
            isActive ? 'sidebar-link active' : 'sidebar-link'
          }
        >
          <i className="bi bi-kanban-fill"></i>
          Board
        </NavLink>
      </nav>
    </aside>
  );
}