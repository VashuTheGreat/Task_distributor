import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth.context';
import socketService from '../services/socket.service';
import ChatMessage from '../components/ChatMessage';
import './Chat.css';

const Chat = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const socket = socketService.connect();
    
    const checkConnection = setInterval(() => {
      setConnected(socketService.isConnected());
    }, 1000);

    if (roomId) {
      socketService.joinRoom(roomId);
    }

    socketService.onMessage((message) => {
      console.log('Received message:', message);
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      clearInterval(checkConnection);
      socketService.offMessage();
      if (roomId) {
        socketService.leaveRoom(roomId);
      }
    };
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    console.log("hel")
    e.preventDefault();

    if (!newMessage.trim()) return;

    const messageData = {
      content: newMessage,
      senderId: user?._id,
      senderName: user?.fullName || user?.name || 'Unknown',
      roomId: roomId,
      timestamp: new Date().toISOString(),
    };

    console.log('Sending message:', messageData);
    socketService.sendMessage(messageData);
    setNewMessage('');
  };

  useEffect(()=>{
    fetch(`http://localhost:3000/fetchChat/${roomId}`).then((data)=>{
      return data.json();
    }).then((data)=>{
      console.log(data);
      setMessages(data.details||[]);
      
    })
   

  },[])

  return (
    <div className="chat-page">
      <div className="chat-container">
        <div className="chat-header">
          <button className="btn-back" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <div className="chat-title">
            <h2>Room Chat</h2>
            <div className="connection-status">
              <span className={`status-dot ${connected ? 'connected' : 'disconnected'}`}></span>
              <span className="status-text">
                {connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>

        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="empty-chat">
              <div className="empty-icon">💬</div>
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <ChatMessage
                key={message._id || message.id || index}
                message={message}
                isOwn={message.senderId === user?._id}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input-form" onSubmit={handleSendMessage}>
          <input
            type="text"
            className="chat-input"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={!connected}
          />
          <button
            type="submit"
            className="btn btn-primary send-btn"
            disabled={!connected || !newMessage.trim()}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
