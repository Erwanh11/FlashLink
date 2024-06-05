import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import '../App.css';

const socket = io('http://localhost:5000');

const Chat = ({ match }) => {
  const { matchId } = match.params;
  const userId = 'currentUserId'; // This should be replaced with the actual current user's ID

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    socket.emit('join', { userId });

    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    const fetchMessages = async () => {
      const res = await axios.get(`/api/messages/${userId}/${matchId}`);
      setMessages(res.data);
    };

    fetchMessages();

    return () => {
      socket.off('message');
    };
  }, [userId, matchId]);

  const sendMessage = (e) => {
    e.preventDefault();
    const message = { sender: userId, receiver: matchId, text };
    socket.emit('sendMessage', message, () => setText(''));
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  return (
    <div className="container">
      <h1>Chat</h1>
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className="message">
            <strong>{message.sender === userId ? 'You' : 'Them'}:</strong> {message.text}
          </div>
        ))}
      </div>
      <form className="chat-form" onSubmit={sendMessage}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
