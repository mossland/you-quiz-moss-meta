import http from 'http';
import bodyParser from 'body-parser';
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import dayjs from 'dayjs';
import cors from 'cors';
import { Request, Response, NextFunction } from 'express';

import personRouter from './routes/person';
import userRouter from './routes/user';
import adminRouter from './routes/admin';


export default class Server {
  public port: number;
  private app: any;
  private server: http.Server;

  constructor(port: string | undefined, limit: string | undefined) {
    this.app = express();

    this.initRouter(parseInt(limit || '0', 10));

    this.server = http.createServer();
    this.server.on('request', this.app);
    this.port = parseInt(port || '3000', 10);
  }

  public async start() {
    this.server.listen(this.port, () => console.log(`app start at ${this.port}`));
  }

  private initRouter(limit: number) {
    this.app.enable('trust proxy');
    this.app.use(helmet());
    this.app.use(compression());
    this.app.disable('x-powered-by');
    
    this.app.use(bodyParser.urlencoded({
      extended: false,
    }));
    this.app.use(bodyParser.json());

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());

    if (process.env.NODE_ENV === 'dev') {
      this.app.use(cors());
    } else {
      this.app.use(cors({
        origin: [
          'https://www.you-quiz.com',
          'https://you-quiz.com',
        ],
        credentials: true,
      }));
    }
    
    this.app.get('/ping', (req: Request, res: Response) => {
      res.status(200).send({
        message: 'pong',
        timestamp: dayjs().toISOString(),
      });
    });

    this.app.use('/person', personRouter);
    this.app.use('/user', userRouter);

    this.app.use('/admin', adminRouter);

    // error handler
    this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      console.log('------------------------------');
      console.log(err);

      if (err.message && err.message.view) {
        res.status(500).json({
          message: err.message.view,
          raw: process.env.NODE_ENV === 'prod' ? undefined : err.message.raw,
        });
      } else {
        res.status(500).json({
          message: 'Internal Server Error',
          raw: process.env.NODE_ENV === 'prod' ? undefined : err.message,
        })
      }
      
    });
  }
}
