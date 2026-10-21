import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import routes from './routes';

export function createApp(): Application {
  const app = express();

  app.use(cors());
  app.use(express.json());

  const publicDir = path.resolve(__dirname, '../public');

  // Serve static frontend UI from public folder
  app.use(express.static(publicDir));

  // Health check endpoint
  app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Explicit route for root frontend dashboard
  app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(publicDir, 'index.html'));
  });

  // Mount API routes
  app.use('/', routes);

  // Fallback to index.html for SPA client-side routes
  app.get('*', (req: Request, res: Response, next) => {
    if (
      req.path.startsWith('/members') ||
      req.path.startsWith('/classes') ||
      req.path.startsWith('/attendance') ||
      req.path.startsWith('/plans') ||
      req.path.startsWith('/payments') ||
      req.path.startsWith('/notifications') ||
      req.path.startsWith('/bookings')
    ) {
      return next();
    }
    res.sendFile(path.join(publicDir, 'index.html'));
  });

  return app;
}

export const app = createApp();
export default app;
