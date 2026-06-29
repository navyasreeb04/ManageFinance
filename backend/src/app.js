const express = require("express");
const cookieParser = require("cookie-parser");
//we just create the server here
const app = express();
const cors = require("cors");
const helmet = require("helmet"); 
const rateLimit = require("express-rate-limit");
const http = require('http'); 
const { Server } = require('socket.io');

// ============ SECURITY MIDDLEWARE ============

// 1. Helmet - Security Headers
app.use(helmet());
// 2. CORS - Allow frontend only
app.use(cors({
  origin: ['http://localhost:5173','https://managefinance-frontend.onrender.com',
  'https://managefinance-backend.onrender.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Idempotency-Key'],
}));

// 3. Rate Limiting - Prevent brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 100 requests per windowMs
  message: { 
    message: 'Too many requests from this IP, please try again later.' 
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply to all routes (or specific ones)
app.use('/api', limiter);

// Stricter limit for auth routes (5 attempts per minute)
const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // 5 attempts
  message: { 
    message: 'Too many login attempts, please try again later.' 
  },
  standardHeaders: true,
  legacyHeaders: false,
});
const aiRouter = require("./routes/ai.routes");
app.use("/api/ai", aiRouter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/forgot-pin', authLimiter);
app.use('/api/auth/verify-pin', authLimiter);
// Add password reset endpoints when you add them
app.use('/api/auth/forgot-password', authLimiter);
app.use('/api/auth/reset-password', authLimiter);

// ============ MIDDLEWARE ============
//middleware to parse JSON request bodies
app.use(express.json());
//middleware to parse cookies from incoming requests
app.use(cookieParser());

/**
 * Routes required
 */
const authRouter = require("./routes/auth.routes");
const accountRouter = require("./routes/account.routes");
const transactionRouter = require("./routes/transaction.routes");

 
app.get("/", (req,res)=>{
    res.send("Ledger service is up and running!")
})
/**
 * useroutes
 */
app.use("/api/auth", authRouter); //all the routes in authRouter will be prefixed with /api/auth
app.use("/api/accounts",accountRouter); //all the routes in accountRouter will be prefixed with /api/accounts
app.use("/api/transactions",transactionRouter); //all the routes in transactionRouter will be prefixed with /api/transactions

// ============ SOCKET.IO SETUP ============
// Create HTTP server from the Express app
const server = http.createServer(app);

// Initialize Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
});

// Store user socket mappings
const userSockets = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('register-user', (userId) => {
    userSockets.set(userId, socket.id);
    console.log('ser registered:', userId);
  });

  socket.on('disconnect', () => {
    for (const [userId, socketId] of userSockets.entries()) {
      if (socketId === socket.id) {
        userSockets.delete(userId);
        console.log('User disconnected:', userId);
        break;
      }
    }
  });
});

// Function to send notification to a specific user
const sendNotification = (userId, message, data = {}) => {
  const socketId = userSockets.get(userId);
  if (socketId) {
    io.to(socketId).emit('notification', { message, data });
    console.log(`Notification sent to ${userId}: ${message}`);
  } else {
    console.log(`User ${userId} not connected`);
  }
};

// Store io and sendNotification on app for use in controllers
app.set('io', io);
app.set('sendNotification', sendNotification);

// Export the server (instead of app) so we can listen with it
module.exports = server;