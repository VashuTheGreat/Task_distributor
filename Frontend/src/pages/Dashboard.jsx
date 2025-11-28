import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth.context';
import apiService from '../services/api.service';
import RoomCard from '../components/RoomCard';
import CreateRoomModal from '../components/CreateRoomModal';
import JoinRoomModal from '../components/JoinRoomModal';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const data = await apiService.getRooms();
      setRooms(data || []);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async (roomData) => {
    try {
      const newRoom = await apiService.createRoom(roomData);
      setRooms([...rooms, newRoom]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create room:', error);
      throw error;
    }
  };

  const handleJoinRoom = async (roomId) => {
    try {
      const room = await apiService.joinRoom(roomId);
      setRooms([...rooms, room]);
      setShowJoinModal(false);
    } catch (error) {
      console.error('Failed to join room:', error);
      throw error;
    }
  };

  const handleRoomClick = (roomId) => {
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <div>
              <h1>Welcome back, {user?.fullName || user?.name || 'User'}!</h1>
              <p className="subtitle">Manage your rooms and collaborate with your team</p>
            </div>
            <div className="header-actions">
              <button
                className="btn btn-outline"
                onClick={() => setShowJoinModal(true)}
              >
                Join Room
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setShowCreateModal(true)}
              >
                Create Room
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-content container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your rooms...</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏠</div>
            <h2>No rooms yet</h2>
            <p>Create a new room or join an existing one to get started</p>
            <div className="empty-actions">
              <button
                className="btn btn-primary"
                onClick={() => setShowCreateModal(true)}
              >
                Create Your First Room
              </button>
              <button
                className="btn btn-outline"
                onClick={() => setShowJoinModal(true)}
              >
                Join a Room
              </button>
            </div>
          </div>
        ) : (
          <div className="rooms-grid">
            {rooms.map((room) => (
              <RoomCard
                key={room._id}
                room={room}
                currentUserId={user?._id}
                onClick={() => handleRoomClick(room._id)}
              />
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateRoomModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateRoom}
        />
      )}

      {showJoinModal && (
        <JoinRoomModal
          onClose={() => setShowJoinModal(false)}
          onJoin={handleJoinRoom}
        />
      )}
    </div>
  );
};

export default Dashboard;
