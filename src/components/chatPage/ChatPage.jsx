import React, { useState, useEffect } from 'react';
import './ChatPage.css'; // Ensure this file exists

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Simulate loading messages from a server
    setMessages([
      { id: 1, text: 'Hello! How can I assist you today?', sender: 'admin' },
      { id: 2, text: 'Hi! I need help with my account.', sender: 'user' },
    ]);
  }, []);

  const handleSend = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { id: messages.length + 1, text: newMessage, sender: 'user' }]);
      setNewMessage('');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chat with Admin</h2>
      </div>
      <div className="chat-body">
        {messages.map(message => (
          <div key={message.id} className={`chat-message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatPage;
