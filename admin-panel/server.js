const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS
app.use(cors({
  origin: process.env.ADMIN_URL || 'http://localhost:3001',
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB (optional for now)
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/admin_panel', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// Admin Schema
const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'super-admin'], default: 'admin' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
adminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Admin = mongoose.model('Admin', adminSchema);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Auth middleware (simplified)
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Simple demo admin
    req.admin = {
      _id: 'demo-admin',
      name: 'Super Admin',
      email: 'admin@example.com',
      role: 'super-admin'
    };
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Invalid token' });
  }
};

// Routes

// Login (simplified without MongoDB)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    // Simple hardcoded admin for demo
    if (email === 'admin@example.com' && password === 'admin123') {
      const token = jwt.sign({ id: 'demo-admin' }, JWT_SECRET, { expiresIn: '7d' });

      res.json({
        success: true,
        token,
        admin: {
          id: 'demo-admin',
          name: 'Super Admin',
          email: 'admin@example.com',
          role: 'super-admin'
        }
      });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get current admin
app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({
    success: true,
    admin: {
      id: req.admin._id,
      name: req.admin.name,
      email: req.admin.email,
      role: req.admin.role
    }
  });
});

// Create default admin (only if no admins exist)
app.post('/api/auth/setup', async (req, res) => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      return res.status(400).json({ success: false, message: 'Admin already exists' });
    }

    const admin = new Admin({
      name: 'Super Admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'super-admin'
    });

    await admin.save();

    res.json({
      success: true,
      message: 'Default admin created',
      admin: {
        email: admin.email,
        password: 'admin123'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Dashboard stats
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    // This would connect to your main site's database
    // For now, returning mock data
    res.json({
      success: true,
      stats: {
        totalProperties: 150,
        activeProperties: 120,
        featuredProperties: 25,
        totalUsers: 500,
        recentActivity: 12
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Admin API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Admin API server running on port ${PORT}`);
});
