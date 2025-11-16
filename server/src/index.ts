import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { initializeDatabase } from './db/schema';
import authRoutes from './routes/authRoutes';
import cvRoutes from './routes/cvRoutes';
import keywordsRoutes from './routes/keywordsRoutes';
import storiesRoutes from './routes/storiesRoutes';
import interviewRoutes from './routes/interviewRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());

// Ignore favicon requests
app.get('/favicon.ico', (req, res) => res.status(204).send());

// Root route
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Interview Coach server is running.' });
});

// Auth routes (public)
app.use('/api/auth', authRoutes);

// Protected routes (require authentication)
app.use('/api/cv', cvRoutes);
app.use('/api/keywords', keywordsRoutes);
app.use('/api/stories', storiesRoutes);
app.use('/api/interview', interviewRoutes);

// Initialize database and start server
initializeDatabase()
  .then(() => {
    console.log('✅ Database initialized successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📧 Email logs saved to server/email_logs.json`);
      console.log(`🧪 For testing, visit: http://localhost:${PORT}/api/auth/latest-email`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to initialize database:', err);
    process.exit(1);
  });

export default app;