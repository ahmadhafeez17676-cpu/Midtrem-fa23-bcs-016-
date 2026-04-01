/**
 * CRUD Application Server
 * Main entry point for the application
 * Supports MongoDB, MySQL, and SQLite databases
 */

// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

// Import database connection modules
const { connectMongoDB, disconnectMongoDB } = require('./config/mongo');
const { connectMySQL } = require('./config/mysql');
const { connectSQLite } = require('./config/sqlite');

// Import routes
const userRoutes = require('./routes/userRoutes');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
const PORT = process.env.PORT || 5000;
const DB_TYPE = process.env.DB_TYPE || 'mysql';

// ===== MIDDLEWARE =====

// CORS — allow any origin in dev (file://, localhost, LAN IP) so the UI always reaches the API
app.use(cors({ origin: true }));

// Body parser middleware to handle JSON and URL-encoded bodies
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to log requests (optional)
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`📨 ${req.method} ${req.path} - ${timestamp}`);
  next();
});

// ===== DATABASE CONNECTION FUNCTION =====

const connectDatabase = async () => {
  try {
    console.log(`🔄 Connecting to ${DB_TYPE.toUpperCase()} database...`);

    // Connect to the primary database
    switch (DB_TYPE.toLowerCase()) {
      case 'mongodb':
        await connectMongoDB();
        app.locals.dbType = 'mongo';
        console.log(`✅ MongoDB connected successfully`);
        break;
      case 'mysql':
        await connectMySQL();
        app.locals.dbType = 'mysql';
        console.log(`✅ MySQL connected successfully`);
        break;
      case 'sqlite':
        await connectSQLite();
        app.locals.dbType = 'sqlite';
        console.log(`✅ SQLite connected successfully`);
        break;
      default:
        throw new Error(`Unsupported database type: ${DB_TYPE}`);
    }

    // Attempt to connect to other databases for persistence (non-blocking with timeout)
    setImmediate(async () => {
      const connectWithTimeout = async (connectFn, name) => {
        try {
          const connectPromise = connectFn();
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Connection timeout')), 3000)
          );
          await Promise.race([connectPromise, timeoutPromise]);
          console.log(`✅ ${name} connected (persistent)`);
        } catch (error) {
          console.log(`⚠️ ${name} not available for persistent connection: ${error.message}`);
        }
      };

      if (DB_TYPE.toLowerCase() !== 'mongodb') {
        await connectWithTimeout(connectMongoDB, 'MongoDB');
      }
      if (DB_TYPE.toLowerCase() !== 'mysql') {
        await connectWithTimeout(connectMySQL, 'MySQL');
      }
      if (DB_TYPE.toLowerCase() !== 'sqlite') {
        await connectWithTimeout(connectSQLite, 'SQLite');
      }
    });

    app.locals.io = io;
    console.log(`🎯 Database initialization complete\n`);
  } catch (error) {
    console.error('❌ Failed to connect to primary database:', error.message);
    console.error('💡 Please check your database configuration and ensure the service is running\n');
    throw new Error('Database connection failed');
  }
};

// ===== ROUTES =====

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  const healthData = {
    success: true,
    message: 'Server is running',
    database: app.locals.dbType,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  };

  console.log(`💚 Health check passed - Database: ${app.locals.dbType}`);
  res.status(200).json(healthData);
});

/**
 * Root endpoint with API information
 */
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CRUD API - Welcome',
    database: DB_TYPE,
    endpoints: {
      health: '/health',
      users: {
        getAll: 'GET /api/users',
        getOne: 'GET /api/users/:id',
        create: 'POST /api/users',
        update: 'PUT /api/users/:id',
        delete: 'DELETE /api/users/:id',
      },      database: {
        get: 'GET /api/database',
        change: 'PUT /api/database',
      },    },
  });
});

/**
 * User API routes
 * All routes are prefixed with /api/users
 */
app.use('/api/users', userRoutes);

/**
 * Database management routes
 */
app.get('/api/database', (req, res) => {
  res.status(200).json({
    success: true,
    currentDatabase: app.locals.dbType,
    availableDatabases: ['mongo', 'mysql', 'sqlite'],
  });
});

app.put('/api/database', async (req, res) => {
  try {
    const { dbType } = req.body;

    if (!dbType || !['mongo', 'mysql', 'sqlite'].includes(dbType.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid database type. Must be mongo, mysql, or sqlite',
      });
    }

    const newDbType = dbType.toLowerCase();

    try {
      switch (newDbType) {
        case 'mongo':
          await connectMongoDB();
          break;
        case 'mysql':
          await connectMySQL();
          break;
        case 'sqlite':
          await connectSQLite();
          break;
      }
    } catch (connectErr) {
      console.error(`Could not connect to ${newDbType}:`, connectErr.message);
      return res.status(503).json({
        success: false,
        error: connectErr.message || `Could not connect to ${newDbType}. Check credentials and that the service is running.`,
      });
    }

    app.locals.dbType = newDbType;
    io.emit('databaseChanged', { newDatabase: newDbType });

    res.status(200).json({
      success: true,
      message: `Database switched to ${newDbType.toUpperCase()}`,
      newDatabase: newDbType,
    });
  } catch (error) {
    console.error('Error switching database:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Error switching database',
    });
  }
});

// ===== ERROR HANDLING MIDDLEWARE =====
// Must be defined after routes

/**
 * 404 Not Found middleware
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

/**
 * Global error handler middleware
 */
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

// ===== SERVER STARTUP =====

/**
 * Starts the server
 */
const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Start listening
    server.listen(PORT, () => {
      console.log(`🚀 Server successfully started on http://localhost:${PORT}`);
      console.log(`📅 Started at: ${new Date().toISOString()}`);
      console.log(`💾 Active database: ${DB_TYPE.toUpperCase()}`);
      console.log(`🔗 API Endpoints:`);
      console.log(`   GET    http://localhost:${PORT}/health`);
      console.log(`   GET    http://localhost:${PORT}/api/users`);
      console.log(`   POST   http://localhost:${PORT}/api/users`);
      console.log(`   GET    http://localhost:${PORT}/api/users/:id`);
      console.log(`   PUT    http://localhost:${PORT}/api/users/:id`);
      console.log(`   DELETE http://localhost:${PORT}/api/users/:id`);
      console.log(`   GET    http://localhost:${PORT}/api/database`);
      console.log(`   PUT    http://localhost:${PORT}/api/database`);
      console.log(`🌐 CORS enabled for localhost origins`);
      console.log(`📡 Socket.io enabled for real-time updates`);
      console.log(`\n✅ Server ready to accept connections!\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

// ===== GRACEFUL SHUTDOWN =====

/**
 * Handles graceful shutdown
 */
process.on('SIGINT', async () => {
  console.log('\n\nShutting down gracefully...');

  try {
    switch (DB_TYPE.toLowerCase()) {
      case 'mongodb':
        await disconnectMongoDB();
        break;
      case 'mysql':
        const { disconnectMySQL } = require('./config/mysql');
        await disconnectMySQL();
        break;
      case 'sqlite':
        const { disconnectSQLite } = require('./config/sqlite');
        await disconnectSQLite();
        break;
    }
    console.log('✓ All connections closed');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error.message);
    process.exit(1);
  }
});

// Start the server if this file is run directly
if (require.main === module) {
  startServer();
}

module.exports = app;
