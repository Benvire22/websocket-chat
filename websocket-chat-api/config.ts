import path from 'path';
import { CorsOptions } from 'cors';

const rootPath = __dirname;

const whiteList: string[] = ['http://localhost:5173', 'http://localhost:5174'];
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || whiteList.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

const config = {
  rootPath,
  corsOptions,
  publicPath: path.join(rootPath, 'public'),
  database: 'mongodb://localhost/websocket-app',
  apiUrl: 'http://localhost:8000/',
};

export default config;
