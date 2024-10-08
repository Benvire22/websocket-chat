import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../users/usersSlice';
import { Grid2, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { ChatMessage } from '../../types';

const Chat = () => {
  const user = useAppSelector(selectUser);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState('');

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8000/chat');

    ws.current.onclose = () => console.log('Connection closed');

    ws.current.onopen = () => {
      ws.current!.send(JSON.stringify({
        type: 'LOGIN',
        payload: user?.token,
      }));
    };

    ws.current.onmessage = (event) => {
      const decodedMessage = JSON.parse(event.data);
      console.log(decodedMessage);

      if (decodedMessage.type === 'MESSAGES') {
        setMessages(decodedMessage.payload as ChatMessage[]);
      }

      if (decodedMessage.type === 'NEW_MESSAGE') {
        setMessages((prevState) => [...prevState, decodedMessage.payload as ChatMessage]);
      }

      if (decodedMessage.type === 'ERROR') {
        window.alert(decodedMessage.payload);
      }

    };

    return () => {
      ws.current?.close();
    };
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    try {
      e.preventDefault();

      if (!ws.current) return;

      ws.current.send(JSON.stringify({
        type: 'SEND_MESSAGE',
        payload: messageText,
      }));

      setMessageText('');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Grid2 container>
      <Grid2 size={4} spacing={2}>
        <Typography variant="h3">Users</Typography>
      </Grid2>
      <Grid2 size={8} flexDirection="column">
        <Typography variant="h3">Chat list</Typography>
        <Grid2 sx={{ mt: 2, height: 600 }}>
          <div>
            {messages.map((message, index) => (
              <div key={index}>
                <b>{message.user}: </b>
                <span>{message.message}</span>
              </div>
            ))}
          </div>
        </Grid2>
        <Grid2>
          <form onSubmit={sendMessage}>
            <input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />
            <button type="submit">Send message</button>
          </form>
        </Grid2>
      </Grid2>
    </Grid2>
  );
};

export default Chat;