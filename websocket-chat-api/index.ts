import express from 'express';
import cors from 'cors';
import expressWs from 'express-ws';
import config from './config';
import mongoose from 'mongoose';
import usersRouter from './routers/users';
import { WebSocket } from 'ws';
import { IncomingMessage, UserMessage } from './types';
import User from './models/User';

const app = express();
expressWs(app);

const port = 8000;

app.use(cors(config.corsOptions));

const chatWsRouter = express.Router();

const connectedClients: WebSocket[] = [];
const messages: UserMessage[] = [];

chatWsRouter.ws('/chat', async (ws, _req) => {
  try {
    connectedClients.push(ws);
    console.log('Client connected! Total clients', connectedClients.length);
    ws.send(JSON.stringify({
      type: 'MESSAGES',
      payload: messages.slice(-30),
    }));

    let username = '';

    ws.on('message', async (message) => {
      try {
        const decodedMessage = JSON.parse(message.toString()) as IncomingMessage;

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

          username = existingUser.displayName;
        }

        if (decodedMessage.type === 'SEND_MESSAGE') {
          const newMessage = {
            user: username,
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

app.use(express.json());
app.use('/users', usersRouter);

app.use(chatWsRouter);

const run = async () => {
  await mongoose.connect(config.database);

  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });

  process.on('exit', () => {
    mongoose.disconnect();
  });
};

void run().catch(console.error);
