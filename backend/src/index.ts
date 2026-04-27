import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './config/database.js';
import clientRoutes from './routes/clients.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.BACKEND_PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Initialize database
initializeDatabase();

// Routes
app.use('/api', clientRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[Server] Running on http://localhost:${PORT}`);
  });
}

export default app;
