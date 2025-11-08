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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Add CSP for local dev: allow connect to localhost
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "http://localhost:5000", "ws://localhost:5000"]
    }
  }
}));

// Initialize routes
initRoutes(app);

// Add a root route to avoid 404 on /
app.get('/', (req, res) => {
  res.send('Interview Coach API is running.');
});

// Serve empty response for Chrome DevTools probe
app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
  res.status(204).end();
});

// Serve React static files
app.use(express.static(path.join(__dirname, '../../client/build')));

// For any other route, serve index.html (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});