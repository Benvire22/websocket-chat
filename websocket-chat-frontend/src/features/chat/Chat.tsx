import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../users/usersSlice';
import { Button, Grid2, TextField, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { ChatMessage, ChatUser } from '../../types';

const Chat = () => {
  const user = useAppSelector(selectUser);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [messageText, setMessageText] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'auto' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

      if (decodedMessage.type === 'MESSAGES') {
        setMessages(decodedMessage.payload as ChatMessage[]);
      }

      if (decodedMessage.type === 'USERS') {
        setUsers(decodedMessage.payload as ChatUser[]);
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
    <Grid2 container spacing={2} >
      <Grid2 size={3}>
        <Typography variant="h3">Users list</Typography>
        <Grid2
          sx={{ my: 2, height: 600, border: '1px solid teal', overflowY: 'scroll', p: 2 }}
        >
          {users.map((user) => (
            <Typography key={user._id} variant="h5" color="primary">{user.displayName}</Typography>
          ))}
        </Grid2>
      </Grid2>
      <Grid2 size={9} flexDirection="column">
        <Typography variant="h3">Chat</Typography>
        <Grid2 sx={{ my: 2, height: 600, border: '1px solid teal', overflowY: 'scroll', px: 2 }}>
          {messages.map((message, index) => (
            <Grid2 key={index}>
              <Typography variant="h5" color="primary">{message.user}: </Typography>
              <Typography variant="h6">{message.message}</Typography>
            </Grid2>
          ))}
          <div ref={chatEndRef} />
        </Grid2>
        <Grid2>
          <Grid2 spacing={2} component="form" onSubmit={sendMessage}>
            <Grid2 size={12} spacing={2} container alignItems="center">
              <TextField
                sx={{ width: 1020 }}
                required
                multiline
                minRows={3}
                label="Description"
                id="description"
                name="description"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
              >
                <span>Send</span>
              </Button>
            </Grid2>
          </Grid2>
        </Grid2>
      </Grid2>
    </Grid2>
  );
};

export default Chat;