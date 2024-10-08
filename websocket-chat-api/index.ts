import express from 'express';
import cors from 'cors';
import expressWs from 'express-ws';
import config from './config';
import mongoose from 'mongoose';
import usersRouter from './routers/users';
import chatWsRouter from './routers/chatWs';

const app = express();
expressWs(app);

const port = 8000;


app.use(cors(config.corsOptions));

app.use(express.json());
app.use('/users', usersRouter);
app.use('/chat', chatWsRouter);


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
