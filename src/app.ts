import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import routes from './routes';

export function createApp(): Application {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Health check endpoint
  app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Mount API routes
  app.use('/', routes);

  return app;
}

export const app = createApp();
export default app;
