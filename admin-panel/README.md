# Admin Panel - Real Estate Management

A secure admin panel for managing your real estate website with authentication and dashboard features.

## Features

- 🔐 Secure authentication with JWT tokens
- 📊 Dashboard with statistics
- 🛡️ Protected routes
- 📱 Responsive design
- 🔌 API integration ready

## Quick Start

### 1. Install Dependencies

```bash
cd admin-panel
npm install
```

### 2. Set up Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/admin_panel
JWT_SECRET=your-super-secret-jwt-key
ADMIN_URL=http://localhost:3001
```

### 3. Start the Application

```bash
# Start both backend and frontend
npm run dev

# Or start them separately:
# Backend only
npm run server

# Frontend only
npm start
```

### 4. Access the Admin Panel

- Frontend: http://localhost:3001
- Backend API: http://localhost:5000

## Default Login Credentials

- **Email:** admin@example.com
- **Password:** admin123

## Setup Default Admin

If you need to create the default admin account, make a POST request to:

```bash
curl -X POST http://localhost:5000/api/auth/setup
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login admin
- `GET /api/auth/me` - Get current admin
- `POST /api/auth/setup` - Create default admin

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Connecting to Your Main Site

### 1. Database Connection

Update the `MONGODB_URI` in your `.env` file to point to your main site's database:

```env
MONGODB_URI=mongodb://localhost:27017/your_main_database
```

### 2. API Integration

The admin panel is designed to work with your existing database. You can:

1. **Share the same database** - Point the admin panel to your main site's database
2. **Create API endpoints** - Add endpoints in your main site to serve data to the admin panel
3. **Use the existing models** - The admin panel can work with your existing property/user models

### 3. CORS Configuration

Update the CORS settings in `server.js` to allow requests from your main site:

```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
```

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting
- Helmet security headers
- Protected routes
- Input validation

## Deployment

### 1. Build for Production

```bash
npm run build
```

### 2. Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
ADMIN_URL=https://your-admin-domain.com
```

### 3. Deploy

- Deploy the backend to a server (Heroku, DigitalOcean, AWS, etc.)
- Deploy the frontend to a static hosting service (Netlify, Vercel, etc.)
- Update the API URLs in your frontend code

## Customization

### Adding New Features

1. **New Pages:** Add components in `src/pages/`
2. **New API Routes:** Add routes in `server.js`
3. **New Models:** Add models in `models/` directory
4. **Styling:** Update `src/index.css` for custom styles

### Database Models

The admin panel includes basic models for:
- Admin users
- Properties (ready to connect to your main site)

You can extend these or connect to your existing models.

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the MONGODB_URI in your .env file

2. **CORS Errors**
   - Update CORS settings in server.js
   - Check the ADMIN_URL environment variable

3. **Authentication Issues**
   - Clear localStorage and try logging in again
   - Check if the JWT_SECRET is set correctly

### Support

For issues or questions:
1. Check the console for error messages
2. Verify your environment variables
3. Ensure all dependencies are installed
4. Check that MongoDB is running and accessible

## Next Steps

1. **Connect to your main site's database**
2. **Add property management features**
3. **Implement user management**
4. **Add analytics and reporting**
5. **Customize the dashboard**
6. **Add more admin features as needed**

The admin panel is now ready to use and can be easily connected to your existing real estate website!
