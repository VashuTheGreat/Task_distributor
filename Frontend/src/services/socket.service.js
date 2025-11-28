import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }

  // Send chat message
  sendMessage(message) {
    if (this.socket?.connected) {
      this.socket.emit('chat message', message);
    } else {
      console.error('Socket not connected');
    }
  }

  // Listen for chat messages
  onMessage(callback) {
    if (this.socket) {
      this.socket.on('chat message', callback);
      this.listeners.set('chat message', callback);
    }
  }

  // Remove message listener
  offMessage() {
    if (this.socket && this.listeners.has('chat message')) {
      const callback = this.listeners.get('chat message');
      this.socket.off('chat message', callback);
      this.listeners.delete('chat message');
    }
  }

  // Join a room (if implementing room-based chat)
  joinRoom(roomId) {
    if (this.socket?.connected) {
      this.socket.emit('join room', roomId);
    }
  }

  // Leave a room
  leaveRoom(roomId) {
    if (this.socket?.connected) {
      this.socket.emit('leave room', roomId);
    }
  }

  isConnected() {
    return this.socket?.connected || false;
  }
}

export default new SocketService();
