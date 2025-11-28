import React, { useState } from 'react';
import './CreateRoomModal.css';

const CreateRoomModal = ({ onClose, onCreate }) => {
  const [roomName, setRoomName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!roomName.trim()) {
      setError('Please enter a room name');
      return;
    }

    setLoading(true);

    try {
      await onCreate({ name: roomName });
    } catch (err) {
      setError(err.message || 'Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Room</h2>
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
            <label htmlFor="roomName" className="input-label">
              Room Name
            </label>
            <input
              type="text"
              id="roomName"
              className="input"
              placeholder="e.g., Project Alpha Team"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              disabled={loading}
              autoFocus
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
                'Create Room'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRoomModal;
