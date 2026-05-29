import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import './ProjectCard.css';

export default function ProjectCard({
  project,
  doneCount,
  totalCount,
  progress,
  onRename,
  onDelete,
}) {
  const [editing, setEditing] = useState(false);

  const [nameValue, setNameValue] = useState(project.name);

  const inputRef = useRef(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  function handleNameClick() {
    setEditing(true);
  }

  function finishEditing() {
    if (!nameValue.trim()) {
      setNameValue(project.name);
      setEditing(false);
      return;
    }

    if (nameValue.trim() !== project.name) {
      onRename(project.id, nameValue.trim());
    }

    setEditing(false);
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      finishEditing();
    }

    if (event.key === 'Escape') {
      setNameValue(project.name);
      setEditing(false);
    }
  }

  return (
    <motion.article
      className="project-card"
      whileHover={{
        y: -8,
        scale: 1.02,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
      }}
    >
      {/* TOP */}

      <div className="project-card-top">
        <div className="project-icon">
          <i className="bi bi-folder-fill"></i>
        </div>

        <button
          type="button"
          className="delete-btn"
          onClick={onDelete}
        >
          <i className="bi bi-trash-fill"></i>
        </button>
      </div>

      {/* TITLE */}

      <div className="project-content">
        {editing ? (
          <input
            ref={inputRef}
            className="project-name-input"
            value={nameValue}
            onChange={(event) =>
              setNameValue(event.target.value)
            }
            onBlur={finishEditing}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <button
            type="button"
            className="project-name"
            onClick={handleNameClick}
          >
            {project.name}
          </button>
        )}

        <p className="project-description">
          Organize tasks and track project workflow
          efficiently.
        </p>
      </div>

      {/* META */}

      <div className="project-meta">
        <div>
          <span className="meta-label">
            Tasks
          </span>

          <strong>{totalCount}</strong>
        </div>

        <div>
          <span className="meta-label">
            Completed
          </span>

          <strong>{doneCount}</strong>
        </div>

        <div>
          <span className="meta-label">
            Created
          </span>

          <strong>
            {new Date(
              project.created_at
            ).toLocaleDateString()}
          </strong>
        </div>
      </div>

      {/* PROGRESS */}

      <div className="project-progress">
        <div className="progress-header">
          <span>Progress</span>

          <span>{progress}%</span>
        </div>

        <div className="progress-track">
          <div
            className="progress-fill"
            style={{
              width: `${progress}%`,
            }}
          ></div>
        </div>
      </div>

      {/* FOOTER */}

      <div className="project-footer">
        <button className="open-board-btn">
          <i className="bi bi-kanban-fill"></i>

          Open Board
        </button>
      </div>
    </motion.article>
  );
}