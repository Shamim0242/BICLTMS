const express = require('express');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const ejs = require('ejs');
const ejsLayouts = require('express-ejs-layouts');
const multer = require('multer');
const fs = require('fs');
const csv = require('csv-parser');

// Import controllers
const authController = require('./controllers/authController');

// Import routes
const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const tripRoutes = require('./routes/tripRoutes');

// Create Express app
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Generate a random session secret
const sessionSecret = crypto.randomBytes(64).toString('hex');

// Session configuration
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(ejsLayouts);
app.set('layout', 'layout');
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);

// Make user data available to all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Routes
app.use('/', authRoutes);
app.use('/vehicle', vehicleRoutes);
app.use('/trips', tripRoutes);

// Home route
app.get('/', (req, res) => {
  console.log('Home route accessed');
  console.log('Session:', req.session);
  console.log('User in session:', req.session.user);
  
  if (req.session.user) {
    // Render the home page for authenticated users
    console.log('User is authenticated, rendering home page');
    console.log('User data:', req.session.user);
    try {
      return res.render('home', { 
        title: 'Home - Fleet Management System',
        user: req.session.user 
      });
    } catch (error) {
      console.error('Error rendering home page:', error);
      return res.status(500).render('error', { message: 'Error rendering home page' });
    }
  }
  console.log('User is not authenticated, rendering login page');
  res.render('login', { error: null, success: null });
});

// Dashboard route (protected)
app.get('/dashboard', authController.isAuthenticated, (req, res) => {
  try {
    console.log('Rendering dashboard for user:', req.session.user);
    res.render('dashboard', { 
      title: 'User Dashboard',
      user: req.session.user 
    });
  } catch (error) {
    console.error('Error rendering dashboard:', error);
    res.status(500).render('error', { message: 'Error rendering dashboard' });
  }
});

// Admin dashboard route (protected)
app.get('/admin/dashboard', authController.isAuthenticated, authController.isAdmin, (req, res) => {
  try {
    console.log('Rendering admin dashboard for user:', req.session.user);
    
    // Get vehicle data to display in the dashboard
    const Vehicle = require('./models/Vehicle');
    const vehicles = Vehicle.getAllVehicles();
    
    // Get vehicle statistics
    const pendingCount = vehicles.filter(v => v.status === 'pending').length;
    const readyCount = vehicles.filter(v => v.status === 'ready').length;
    const outCount = vehicles.filter(v => v.status === 'out').length;
    const activeCount = vehicles.filter(v => v.status === 'active').length;
    const maintenanceCount = vehicles.filter(v => v.status === 'maintenance').length;
    
    res.render('admin-dashboard', { 
      title: 'Admin Dashboard',
      user: req.session.user,
      vehicles: vehicles,
      stats: {
        pending: pendingCount,
        ready: readyCount,
        out: outCount,
        active: activeCount,
        maintenance: maintenanceCount,
        total: vehicles.length
      }
    });
  } catch (error) {
    console.error('Error rendering admin dashboard:', error);
    res.status(500).render('error', { message: 'Error rendering admin dashboard' });
  }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, 'vehicles-' + Date.now() + '.csv')
  }
});
const upload = multer({ storage: storage });

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Theme settings route (protected)
app.get('/settings/theme', authController.isAuthenticated, (req, res) => {
  try {
    console.log('Rendering theme settings page for user:', req.session.user);
    res.render('theme-settings', { 
      title: 'Theme Settings',
      user: req.session.user 
    });
  } catch (error) {
    console.error('Error rendering theme settings page:', error);
    res.status(500).render('error', { message: 'Error rendering theme settings page' });
  }
});

// Handle background image upload
app.post('/settings/theme/background', authController.isAuthenticated, upload.single('backgroundImage'), (req, res) => {
  try {
    // In a real application, you would process the image, save it, and update the user's preferences
    // For this demo, we just handle the client-side background with JavaScript
    res.json({ success: true });
  } catch (error) {
    console.error('Error uploading background image:', error);
    res.status(500).json({ error: 'Error uploading background image' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('error', { message: 'Page not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('error', { message: 'Internal Server Error' });
});

// Start the server
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Fleet Management server running at http://localhost:${port}`);
  console.log(`For local network access try: http://<your-local-ip>:${port}`);
  
  // Log server address info safely
  try {
    const address = server.address();
    if (address) {
      console.log(`Server listening on ${address.address}:${address.port}`);
    }
  } catch (error) {
    console.error('Could not get server address information', error);
  }
}); 