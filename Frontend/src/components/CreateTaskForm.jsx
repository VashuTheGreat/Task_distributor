import React, { useState } from 'react';
import './CreateTaskForm.css';

const CreateTaskForm = ({ onClose, onCreate, roomMembers = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigned_to: '',
    status: 'todo',
    deadline: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Please enter a task title');
      return;
    }

    setLoading(true);

    try {
      const taskData = {
        title: formData.title,
        description: formData.description,
        asign_id: formData.assigned_to || null,
        status: formData.status,
        deadline: formData.deadline || null,
      };
      await onCreate(taskData);
    } catch (err) {
      setError(err.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Task</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <div className="input-group">
            <label htmlFor="title" className="input-label">
              Task Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="input"
              placeholder="e.g., Implement user authentication"
              value={formData.title}
              onChange={handleChange}
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="input-group">
            <label htmlFor="description" className="input-label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="input textarea"
              placeholder="Add task details..."
              rows="4"
              value={formData.description}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label htmlFor="assigned_to" className="input-label">
              Assign To
            </label>
            <select
              id="assigned_to"
              name="assigned_to"
              className="input"
              value={formData.assigned_to}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">Unassigned</option>
              {roomMembers.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.fullName} ({member.userName})
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="status" className="input-label">
              Status
            </label>
            <select
              id="status"
              name="status"
              className="input"
              value={formData.status}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="deadline" className="input-label">
              Deadline (Optional)
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              className="input"
              value={formData.deadline}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner-small"></div>
                  Creating...
                </>
              ) : (
                'Create Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskForm;
