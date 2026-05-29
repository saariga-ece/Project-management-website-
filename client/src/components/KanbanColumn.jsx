import TaskCard from './TaskCard.jsx';

import './KanbanColumn.css';

export default function KanbanColumn({
  status,
  tasks,
  onEdit,
  onDelete,
  onDrop,
  onDragOver,
  onDragLeave,
  activeDrop,
}) {
  function getColumnIcon() {
    if (status === 'To Do') {
      return 'bi-list-check';
    }

    if (status === 'In Progress') {
      return 'bi-lightning-charge-fill';
    }

    return 'bi-check-circle-fill';
  }

  function getColumnClass() {
    if (status === 'To Do') {
      return 'todo-column';
    }

    if (status === 'In Progress') {
      return 'progress-column';
    }

    return 'done-column';
  }

  return (
    <section
      className={`kanban-column ${getColumnClass()} ${
        activeDrop ? 'kanban-column-drop' : ''
      }`}
      onDragOver={(event) => {
        event.preventDefault();
        onDragOver();
      }}
      onDragLeave={onDragLeave}
      onDrop={(event) => {
        event.preventDefault();

        const taskId =
          event.dataTransfer.getData('text/plain');

        onDrop(taskId, status);
      }}
    >
      {/* HEADER */}

      <header className="kanban-column-header">
        <div className="column-title">
          <div className="column-icon">
            <i className={`bi ${getColumnIcon()}`}></i>
          </div>

          <div>
            <h3>{status}</h3>
            <p>{tasks.length} Tasks</p>
          </div>
        </div>

        <span className="task-count">
          {tasks.length}
        </span>
      </header>

      {/* TASK LIST */}

      <div className="kanban-task-list">
        {tasks.length === 0 ? (
          <div className="kanban-empty">
            <i className="bi bi-inbox"></i>

            <p>No tasks available</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </section>
  );
}