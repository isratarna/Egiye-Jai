const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

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

app.use('/api/auth',          require('./routes/auth'));
app.use('/api/users',         require('./routes/users'));
app.use('/api/opportunities', require('./routes/opportunities'));
app.use('/api/applications',  require('./routes/applications'));
app.use('/api/contact',       require('./routes/contact'));
app.use('/api/admin',         require('./routes/admin'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

const DIRECT_URI = `mongodb://isratjahanarna_db_user:VvnYiVLw3HaMmxxf@ac-xf44bte-shard-00-00.0ybw4zc.mongodb.net:27017,ac-xf44bte-shard-00-01.0ybw4zc.mongodb.net:27017,ac-xf44bte-shard-00-02.0ybw4zc.mongodb.net:27017/egiyejai?ssl=true&authSource=admin&retryWrites=true&w=majority`;

console.log('🔄 Connecting to MongoDB Atlas...');

mongoose.connect(DIRECT_URI, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  family: 4,
  tls: true,
})
  .then(async () => {
    console.log('✅ MongoDB connected to:', mongoose.connection.host);
    console.log('📦 Database:', mongoose.connection.name);
    await require('./utils/seedAdmin')();
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('   → Check Atlas Network Access: 0.0.0.0/0 must be whitelisted');
    console.error('   → Try mobile hotspot if your ISP blocks port 27017');
    process.exit(1);
  });
