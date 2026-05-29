import { motion } from 'framer-motion';
import './TaskCard.css';

export default function TaskCard({ task, onEdit, onDelete }) {
  function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', task.id);
    event.dataTransfer.effectAllowed = 'move';
  }

  return (
    <motion.article
      className="task-card"
      draggable="true"
      onDragStart={handleDragStart}
      whileHover={{
        y: -6,
        scale: 1.02,
      }}
      whileTap={{
        scale: 0.98,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
    >
      {/* TOP SECTION */}
      <div className="task-card-top">
        <div className="task-user">
          <div className="user-avatar">
            {task.assignee
              ? task.assignee.charAt(0).toUpperCase()
              : 'U'}
          </div>

          <div>
            <h4>{task.title}</h4>
            <p>{task.assignee || 'Unassigned'}</p>
          </div>
        </div>

        <span
          className={`task-priority priority-${task.priority.toLowerCase()}`}
        >
          {task.priority}
        </span>
      </div>

      {/* DESCRIPTION */}
      <p className="task-description">
        {task.description || 'No description'}
      </p>

      {/* FOOTER */}
      <div className="task-footer">
        <div className="task-status">
          <i className="bi bi-circle-fill"></i>
          {task.status}
        </div>

        <div className="task-actions">
          <button
            type="button"
            onClick={() => onEdit(task)}
            aria-label="Edit task"
          >
            <i className="bi bi-pencil-fill"></i>
          </button>

          <button
            type="button"
            onClick={() => onDelete(task.id)}
            aria-label="Delete task"
          >
            <i className="bi bi-trash-fill"></i>
          </button>
        </div>
      </div>
    </motion.article>
  );
}