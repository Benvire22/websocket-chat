import express from 'express';
import { WebSocket } from 'ws';
import { IncomingMessage, UserMessage } from '../types';
import User from '../models/User';

const chatWsRouter = express.Router();

const connectedClients: WebSocket[] = [];
const messages: UserMessage[] = [];

chatWsRouter.ws('/', async (ws) => {
  try {
    connectedClients.push(ws);
    console.log('Client connected! Total clients', connectedClients.length);
    ws.send(JSON.stringify(messages.splice(-30)));

    ws.on('message', async (message) => {
      try {
        const decodedMessage = JSON.parse(message.toString()) as IncomingMessage;

        let user = '';

        if (decodedMessage.type === 'LOGIN') {
          const existingUser = await User.findOne({ token: decodedMessage.payload });

          if (!existingUser) {
            ws.send(JSON.stringify({
              type: 'ERROR',
              payload: 'Wrong token',
            }));

            ws.close();
            return;
          }

          user = existingUser.displayName;
        }

        if (decodedMessage.type === 'SEND_MESSAGE') {
          const newMessage = {
            user,
            message: decodedMessage.payload,
          };

          connectedClients.forEach((clientWs) => {
            clientWs.send(JSON.stringify({
              type: 'NEW_MESSAGE',
              payload: newMessage,
            }));
          });

          messages.push(newMessage);
        }

      } catch (e) {
        ws.send(JSON.stringify({
          type: 'ERROR',
          payload: 'Invalid message!',
        }));
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected!');
      const index = connectedClients.indexOf(ws);
      connectedClients.splice(index, 1);
    });
  } catch (e) {
    console.error(e);
  }
});

export default chatWsRouter;