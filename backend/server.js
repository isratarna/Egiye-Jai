const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const dns = require('dns');

dotenv.config();

dns.setServers(['8.8.8.8', '1.1.1.1']);

const app = express();

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (/^http:\/\/localhost:\d+$/.test(origin)) return callback(null, true);
    if (/^http:\/\/127\.0\.0\.1:\d+$/.test(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/opportunities', require('./routes/opportunities'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/problems', require('./routes/problems'));
app.use('/api/upload', require('./routes/upload'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Connect DB & start server
const PORT = process.env.PORT || 5000;

const mongoOptions = {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  family: 4,   // force IPv4 — fixes querySrv ECONNREFUSED on some networks
  maxPoolSize: 10,
};

console.log('🔄 Connecting to MongoDB Atlas...');

mongoose.connect(process.env.MONGODB_URI, mongoOptions)
  .then(async () => {
    console.log('✅ MongoDB connected to:', mongoose.connection.host);
    console.log('📦 Database:', mongoose.connection.name);
    await require('./utils/seedAdmin')();
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('');
    console.error('🔧 Troubleshooting steps:');
    console.error('   1. Atlas → Network Access → Add 0.0.0.0/0 (allow from anywhere)');
    console.error('   2. Atlas → Database Access → confirm user exists with readWrite role');
    console.error('   3. Check .env → MONGODB_URI has /egiyejai before the ?');
    console.error('   4. Try switching to mobile hotspot (ISP may block port 27017)');
    process.exit(1);
  });
