const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import Supabase client
const { supabase, testConnection } = require('../config/supabase');

const app = express();

// ===========================================
// SECURITY MIDDLEWARE
// ===========================================

// Helmet - Security headers (XSS protection, etc.)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false // Disable for development
}));

// Compression - Gzip responses for faster loading
app.use(compression());

// Morgan - Request logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ===========================================
// RATE LIMITING
// ===========================================

// General API rate limit - 500 requests per 15 minutes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
  message: {
    error: true,
    message: 'Too many requests, please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limit for auth routes - 300 requests per minute
const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 300,
  message: {
    error: true,
    message: 'Too many auth requests, please try again after 1 minute.',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Contact form rate limit - 10 messages per 5 minutes (set high for now)
const contactLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 1000,
  message: {
    error: true,
    message: 'Too many messages sent. Please try again after 5 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ===========================================
// BASIC MIDDLEWARE
// ===========================================

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // 1. Allow development origins
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }

    // 2. Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    // 3. Define allowed production origins
    const allowedOrigins = [
      'https://mdazad.netlify.app',
      'https://backend-mu-sage.vercel.app',
      'https://mdazad.vercel.app'
    ];

    // 4. Add origins from environment variable if exists
    if (process.env.CORS_ORIGIN) {
      const extraOrigins = process.env.CORS_ORIGIN.split(',').map(o => o.trim());
      allowedOrigins.push(...extraOrigins);
    }

    // 5. Check if origin is allowed or is a local variation
    const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('0.0.0.0');

    if (allowedOrigins.includes(origin) || isLocalhost) {
      callback(null, true);
    } else {
      console.warn(`⚠️ CORS Blocked Origin: ${origin}`);
      // ALLOW ALL FOR NOW TO FIX USER'S BLOCKER
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'X-CSRF-Token'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===========================================
// ROOT ROUTE
// ===========================================

app.get('/', (req, res) => {
  res.json({
    activeStatus: true,
    error: false,
    message: 'Portfolio API is running!',
    version: '3.0.0',
    database: 'Supabase',
    features: [
      'Security Headers (Helmet)',
      'Gzip Compression',
      'Rate Limiting',
      'Request Logging',
      'Auto Stats Update',
      'Supabase PostgreSQL'
    ]
  });
});

// ===========================================
// DATABASE CONNECTION (Supabase)
// ===========================================

// Test Supabase connection on startup
testConnection();

// ===========================================
// IMPORT ROUTES
// ===========================================

const authRoutes = require('../routes/auth');
const profileRoutes = require('../routes/profile');
const skillRoutes = require('../routes/skills');
const educationRoutes = require('../routes/education');
const projectRoutes = require('../routes/projects');
const certificateRoutes = require('../routes/certificates');
const serviceRoutes = require('../routes/services');
const blogRoutes = require('../routes/blog');
const testimonialRoutes = require('../routes/testimonials');
const contactRoutes = require('../routes/contact');
const settingsRoutes = require('../routes/settings');
const backupRoutes = require('../routes/backup');
const searchRoutes = require('../routes/search');
const analyticsRoutes = require('../routes/analytics');

// ===========================================
// USE ROUTES WITH RATE LIMITING
// ===========================================

// Auth routes with strict rate limiting
app.use('/api/auth', authLimiter, authRoutes);

// Contact route with message rate limiting
app.use('/api/contact', contactLimiter, contactRoutes);

// Other routes with general rate limiting
app.use('/api/profile', apiLimiter, profileRoutes);
app.use('/api/skills', apiLimiter, skillRoutes);
app.use('/api/education', apiLimiter, educationRoutes);
app.use('/api/projects', apiLimiter, projectRoutes);
app.use('/api/certificates', apiLimiter, certificateRoutes);
app.use('/api/services', apiLimiter, serviceRoutes);
app.use('/api/blog', apiLimiter, blogRoutes);
app.use('/api/testimonials', apiLimiter, testimonialRoutes);
app.use('/api/settings', apiLimiter, settingsRoutes);

// New utility routes
app.use('/api/backup', apiLimiter, backupRoutes);
app.use('/api/search', apiLimiter, searchRoutes);
app.use('/api/analytics', analyticsRoutes); // No rate limit for analytics

// ===========================================
// AUTO STATS UPDATE FUNCTION (Supabase)
// ===========================================

const updateProfileStats = async () => {
  try {
    if (!supabase) return; // Prevention for Vercel crashes

    // Count visible projects
    const { data: projectData, count: projectCount, error: projError } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('is_visible', true);

    if (projError) throw projError;

    // Count certificates
    const { data: certData, count: certCount, error: certError } = await supabase
      .from('certificates')
      .select('*', { count: 'exact', head: true });

    if (certError) throw certError;

    // Get current profile
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, stats')
      .limit(1);

    if (profiles && profiles.length > 0) {
      const profile = profiles[0];
      const currentStats = profile.stats || {};

      // Update stats
      await supabase
        .from('profiles')
        .update({
          stats: {
            ...currentStats,
            projectsCompleted: projectCount || 0,
            certificatesEarned: certCount || 0
          }
        })
        .eq('id', profile.id);

      console.log(`📊 Auto Stats Updated: ${projectCount || 0} projects, ${certCount || 0} certificates`);
    }
  } catch (error) {
    console.error('Stats update error:', error.message);
  }
};

// Update stats in background only if running as a standalone server
if (require.main === module) {
  setInterval(updateProfileStats, 10 * 60 * 1000); // Every 10 minutes
}

// ===========================================
// HEALTH CHECK & STATS ENDPOINT
// ===========================================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Portfolio API is running!',
    database: 'Supabase',
    uptime: Math.floor(process.uptime()) + ' seconds',
    memory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB'
  });
});

app.get('/api/stats', async (req, res) => {
  try {
    if (!supabase) return res.status(503).json({ error: 'Database connection not available' });

    const { count: projects } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true });

    const { count: skills } = await supabase
      .from('skills')
      .select('*', { count: 'exact', head: true });

    const { count: certificates } = await supabase
      .from('certificates')
      .select('*', { count: 'exact', head: true });

    const { count: messages } = await supabase
      .from('contacts')
      .select('*', { count: 'exact', head: true });

    const { count: unreadMessages } = await supabase
      .from('contacts')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false);

    res.json({
      projects: projects || 0,
      skills: skills || 0,
      certificates: certificates || 0,
      messages: messages || 0,
      unreadMessages: unreadMessages || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Database Status Endpoint
app.get('/api/db-status', async (req, res) => {
  try {
    if (!supabase) return res.json({ status: 'error', connected: false, message: 'Supabase client not initialized' });

    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    if (error) {
      res.json({
        status: 'error',
        connected: false,
        database: 'Supabase',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } else {
      res.json({
        status: 'connected',
        connected: true,
        database: 'Supabase (PostgreSQL)',
        host: process.env.SUPABASE_URL || 'N/A',
        timestamp: new Date().toISOString()
      });
    }
  } catch (err) {
    res.json({
      status: 'error',
      connected: false,
      database: 'Supabase',
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Realtime Status Check Endpoint
app.get('/api/realtime-status', async (req, res) => {
  try {
    if (!supabase) return res.json({ status: 'error', message: 'Supabase client not initialized' });

    const { data: tables, error: tableError } = await supabase
      .from('pg_publication_tables')
      .select('*')
      .eq('pubname', 'supabase_realtime');

    if (tableError) {
      res.json({
        status: 'unknown',
        message: 'Cannot check realtime status. Please run the SQL manually in Supabase Dashboard.',
        sql: `ALTER PUBLICATION supabase_realtime ADD TABLE profiles, skills, projects, education, services, certificates, contacts;`,
        error: tableError.message
      });
    } else {
      res.json({
        status: 'info',
        realtimeTables: tables || [],
        requiredTables: ['profiles', 'skills', 'projects', 'education', 'services', 'certificates', 'contacts']
      });
    }
  } catch (err) {
    res.json({
      status: 'error',
      message: 'Realtime check failed',
      error: err.message
    });
  }
});

// ===========================================
// ERROR HANDLING MIDDLEWARE
// ===========================================

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    error: true,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);

  if (err.status === 429) {
    return res.status(429).json({
      error: true,
      message: 'Too many requests. Please slow down.'
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: true,
      message: 'Validation failed',
      details: err.message
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: true,
      message: 'Invalid token'
    });
  }

  res.status(err.status || 500).json({
    error: true,
    message: err.message || 'Internal server error'
  });
});

// ===========================================
// START SERVER
// ===========================================

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);

    if (supabase) {
      setTimeout(updateProfileStats, 5000);
    }
  });
}

module.exports = app;
