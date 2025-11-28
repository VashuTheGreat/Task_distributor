import React from 'react';
import './RoomCard.css';

const RoomCard = ({ room, currentUserId, onClick }) => {
  const memberCount = room.members?.length || 0;
  const isAdmin = room.createdBy?._id === currentUserId || room.createdBy === currentUserId;

  return (
    <div className="room-card" onClick={onClick}>
      <div className="room-card-header">
        <div className="room-icon">
          <span>🏠</span>
        </div>
        {isAdmin && <span className="admin-badge">Admin</span>}
      </div>

      <div className="room-card-body">
        <h3 className="room-name">{room.name}</h3>
        <div className="room-meta">
          <div className="meta-item">
            <span className="meta-icon">👥</span>
            <span className="meta-text">{memberCount} members</span>
          </div>
          {room.createdBy?.fullName && (
            <div className="meta-item">
              <span className="meta-icon">👤</span>
              <span className="meta-text">By {room.createdBy.fullName}</span>
            </div>
          )}
        </div>
      </div>

      <div className="room-card-footer">
        <button className="btn-link">Open Room →</button>
      </div>
    </div>
  );
};

export default RoomCard;
