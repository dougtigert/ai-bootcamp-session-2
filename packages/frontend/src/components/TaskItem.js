import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { formatRelativeDate, isPastDate, isWithinDays } from '../utils/dateFormatter';
import './TaskItem.css';

const TaskItem = ({ task, onToggleComplete, onEdit, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const getPriorityClass = (priority) => {
    return `priority-${priority}`;
  };

  const getDueDateClass = () => {
    if (!task.due_date) return '';
    if (task.completed) return '';
    if (isPastDate(task.due_date)) return 'due-overdue';
    if (isWithinDays(task.due_date, 3)) return 'due-soon';
    return '';
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      try {
        await onDelete(task.id);
      } catch (error) {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className={`task-item ${task.completed ? 'task-item--completed' : ''} ${isDeleting ? 'task-item--deleting' : ''}`}>
      <div className="task-item__checkbox">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task.id)}
          className="task-checkbox"
          aria-label={`Mark task "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
        />
      </div>

      <div className="task-item__content">
        <h3 className={`task-item__title ${task.completed ? 'task-item__title--completed' : ''}`}>
          {task.title}
        </h3>
        
        {task.description && (
          <p className="task-item__description">{task.description}</p>
        )}

        <div className="task-item__meta">
          <span className={`task-priority ${getPriorityClass(task.priority)}`}>
            <span className="priority-icon">🚩</span>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
          
          {task.due_date && (
            <span className={`task-due-date ${getDueDateClass()}`}>
              <span className="due-date-icon">📅</span>
              {formatRelativeDate(task.due_date)}
            </span>
          )}
        </div>
      </div>

      <div className="task-item__actions">
        <button
          onClick={() => onEdit(task)}
          className="task-action-btn task-action-btn--edit"
          aria-label={`Edit task "${task.title}"`}
          title="Edit"
        >
          ✏️
        </button>
        
        <button
          onClick={handleDelete}
          className="task-action-btn task-action-btn--delete"
          aria-label={`Delete task "${task.title}"`}
          title="Delete"
          disabled={isDeleting}
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

TaskItem.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    completed: PropTypes.bool.isRequired,
    priority: PropTypes.oneOf(['low', 'medium', 'high']).isRequired,
    due_date: PropTypes.string
  }).isRequired,
  onToggleComplete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default TaskItem;
