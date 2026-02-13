import React from 'react';
import PropTypes from 'prop-types';
import TaskItem from './TaskItem';
import './TaskList.css';

const TaskList = ({ tasks, onToggleComplete, onEdit, onDelete, isLoading }) => {
  if (isLoading) {
    return (
      <div className="task-list-empty">
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="task-list-empty">
        <p>No tasks found. Add some to get started!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      completed: PropTypes.bool.isRequired,
      priority: PropTypes.oneOf(['low', 'medium', 'high']).isRequired,
      due_date: PropTypes.string
    })
  ).isRequired,
  onToggleComplete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isLoading: PropTypes.bool
};

export default TaskList;
