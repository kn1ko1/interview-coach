import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './routes/index';

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Development-safe CSP: allow same-origin connections and localhost dev server.
// Allow requests to /.well-known/* (DevTools/extension probe) with a slightly relaxed connect-src.
app.use((req: Request, res: Response, next: NextFunction) => {
  const isWellKnown = req.path.startsWith('/.well-known');
  const base = "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline';";
  const devConnect = "connect-src 'self' http://localhost:5000 http://127.0.0.1:5000 http://172.28.253.134:3000 ws:;";
  const relaxedConnect = "connect-src *;";
  console.log('[CSP middleware] incoming', req.method, req.path, 'NODE_ENV=', process.env.NODE_ENV);
  const cspValue =
    process.env.NODE_ENV !== 'production'
      ? `${base} ${isWellKnown ? relaxedConnect : devConnect} script-src 'self' 'unsafe-inline' 'unsafe-eval';`
      : `${base} connect-src 'self'; script-src 'self';`;
  // ensure any previous header is not unexpectedly set by other middleware
  res.removeHeader && res.removeHeader('Content-Security-Policy');
  res.setHeader('Content-Security-Policy', cspValue);
  console.log('[CSP middleware] set CSP ->', cspValue);
  next();
});

// Routes
app.use('/api', routes);

// Add a simple root route so GET / does not 404
app.get('/', (req: Request, res: Response) => {
  console.log('[GET /] hit');
  res.send('Interview Coach API running. Visit the client at http://localhost:3000/');
});

// Error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(err?.status || 500).json({ message: err?.message || 'Internal Server Error' });
});

export default app;