import { useEffect, useState } from 'react';

import './TaskModal.css';

export default function TaskModal({
  open,
  task,
  onClose,
  onSave,
}) {
  const [formValues, setFormValues] = useState({
    title: '',
    description: '',
    assignee: '',
    priority: 'Medium',
  });

  useEffect(() => {
    if (!task) {
      return;
    }

    setFormValues({
      title: task.title || '',
      description: task.description || '',
      assignee: task.assignee || '',
      priority: task.priority || 'Medium',
    });
  }, [task]);

  if (!open || !task) {
    return null;
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormValues((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    await onSave({
      ...task,
      ...formValues,
    });
  }

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        className="task-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* HEADER */}

        <header className="task-modal-header">
          <div>
            <p className="modal-subtitle">
              TASK MANAGEMENT
            </p>

            <h2>
              {task.id
                ? 'Edit Task'
                : 'Create New Task'}
            </h2>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </header>

        {/* FORM */}

        <form
          className="task-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label>Task Title</label>

            <input
              type="text"
              name="title"
              value={formValues.title}
              onChange={handleChange}
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              name="description"
              rows="4"
              value={formValues.description}
              onChange={handleChange}
              placeholder="Write task details"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Assignee</label>

              <input
                type="text"
                name="assignee"
                value={formValues.assignee}
                onChange={handleChange}
                placeholder="Assign member"
              />
            </div>

            <div className="form-group">
              <label>Priority</label>

              <select
                name="priority"
                value={formValues.priority}
                onChange={handleChange}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>

          {/* ACTIONS */}

          <div className="task-form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-btn"
            >
              <i className="bi bi-check-circle-fill"></i>

              Save Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}