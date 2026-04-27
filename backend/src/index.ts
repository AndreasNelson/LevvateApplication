import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { initializeDatabase } from './config/database.js';
import clientRoutes from './routes/clients.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || process.env.BACKEND_PORT || 5000;

// Security Middleware
app.use(helmet());
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [/\.onrender\.com$/, /\.vercel\.app$/, /localhost:3000/] // Allow Render, Vercel, and local dev
    : true, // Allow all in dev
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

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
