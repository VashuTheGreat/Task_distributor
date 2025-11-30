import React, { useState } from 'react';
import axios from 'axios';
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
  const [showAiInput, setShowAiInput] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleAiGenerate = async () => {
    if (!aiQuery.trim()) {
      setError('Please enter a query for AI generation');
      return;
    }

    setAiLoading(true);
    setError('');

    try {
      const response = await axios.post('/python/airesponse', {
        query: aiQuery
      });

      // Auto-fill title and description
      setFormData({
        ...formData,
        title: response.data.title,
        description: response.data.description
      });

      setShowAiInput(false);
      setAiQuery('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate task with AI');
    } finally {
      setAiLoading(false);
    }
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

          {/* AI Generation Section */}
          <div className="ai-generation-section">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setShowAiInput(!showAiInput)}
              disabled={loading}
              style={{ marginBottom: '10px', width: '100%' }}
            >
              {showAiInput ? '❌ Cancel AI Generation' : '✨ Generate with AI'}
            </button>

            {showAiInput && (
              <div className="ai-input-container" style={{ marginBottom: '20px' }}>
                <div className="input-group">
                  <label htmlFor="aiQuery" className="input-label">
                    Describe your task
                  </label>
                  <input
                    type="text"
                    id="aiQuery"
                    className="input"
                    placeholder="e.g., I want to create a project about natural language processing"
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    disabled={aiLoading}
                    autoFocus
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAiGenerate}
                  disabled={aiLoading}
                  style={{ width: '100%' }}
                >
                  {aiLoading ? (
                    <>
                      <div className="spinner-small"></div>
                      Generating...
                    </>
                  ) : (
                    '🤖 Generate Task'
                  )}
                </button>
              </div>
            )}
          </div>

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
