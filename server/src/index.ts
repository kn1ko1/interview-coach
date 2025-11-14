import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import initRoutes from './routes'; // adjust path if different
import path from 'path';

const app = express();
const server = createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());

// Ignore favicon requests to prevent 404 errors in logs
app.get('/favicon.ico', (req, res) => res.status(204).send());

// API routes
// app.use('/api/users', userRoutes);
// app.use('/api/interview', interviewRoutes);

// Add a root route for development status check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Interview Coach server is running.' });
});

// Serve frontend only in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, '../../client/build')));

  // The "catchall" handler: for any request that doesn't
  // match one above, send back React's index.html file.
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/build/index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});