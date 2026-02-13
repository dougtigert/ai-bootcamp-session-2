import React from 'react';
import PropTypes from 'prop-types';
import './TaskFilter.css';

const TaskFilter = ({ filters, onFilterChange }) => {
  const handleStatusChange = (e) => {
    onFilterChange({ ...filters, status: e.target.value });
  };

  const handlePriorityChange = (e) => {
    onFilterChange({ ...filters, priority: e.target.value });
  };

  return (
    <div className="task-filter">
      <div className="filter-group">
        <label htmlFor="filter-status">Status:</label>
        <select
          id="filter-status"
          value={filters.status}
          onChange={handleStatusChange}
          className="filter-select"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="filter-priority">Priority:</label>
        <select
          id="filter-priority"
          value={filters.priority}
          onChange={handlePriorityChange}
          className="filter-select"
        >
          <option value="all">All</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
    </div>
  );
};

TaskFilter.propTypes = {
  filters: PropTypes.shape({
    status: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired
};

export default TaskFilter;
