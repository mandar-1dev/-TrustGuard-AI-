import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config/env.js';
import { apiRateLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import scanRoutes from './routes/scanRoutes.js';
import privacyRoutes from './routes/privacyRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import profileRoutes from './routes/profileRoutes.js';

const app = express();

// Security and utility middlewares
app.use(cors({
  origin: [config.clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(morgan('dev'));

// General rate limiter for all API endpoints
app.use('/api', apiRateLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'TrustGuard AI Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: config.isSupabaseConfigured ? 'supabase-postgresql' : 'local-resilient-store',
    aiEngine: config.isGeminiConfigured ? 'gemini-api' : 'heuristic-security-engine'
  });
});

// Mount application API routes
app.use('/api/auth', authRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/privacy', privacyRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/profile', profileRoutes);

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const server = app.listen(config.port, () => {
  console.log(`
🛡️  ======================================================
🛡️   TRUSTGUARD AI BACKEND STARTED
🛡️   Port: ${config.port}
🛡️   Client URL: ${config.clientUrl}
🛡️   Database: ${config.isSupabaseConfigured ? 'Supabase PostgreSQL' : 'Local Resilient Engine (Pre-seeded with demo account)'}
🛡️   AI Engine: ${config.isGeminiConfigured ? 'Google Gemini API (' + config.geminiModel + ')' : 'Heuristic Cybersecurity Engine (Demo Mode)'}
🛡️  ======================================================
  `);
});

export default app;
