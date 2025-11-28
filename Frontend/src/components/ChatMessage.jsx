import React from 'react';
import './ChatMessage.css';

const ChatMessage = ({ message, isOwn }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`chat-message ${isOwn ? 'own-message' : 'other-message'}`}>
      {!isOwn && (
        <div className="message-avatar">
          {message.senderName?.charAt(0).toUpperCase() || '?'}
        </div>
      )}
      
      <div className="message-content-wrapper">
        {!isOwn && (
          <div className="message-sender">{message.senderName || 'Unknown'}</div>
        )}
        <div className="message-bubble">
          <p className="message-text">{message.content}</p>
          <span className="message-time">{formatTime(message.timestamp || message.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
