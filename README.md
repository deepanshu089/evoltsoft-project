# EV Charging Station Management System

A full-stack application for managing electric vehicle charging stations, featuring real-time status monitoring, interactive map view, and user authentication.

## 🌟 Features

- **User Authentication**
  - Secure login and registration
  - JWT-based authentication
  - Protected routes

- **Charging Station Management**
  - CRUD operations for charging stations
  - Real-time status updates
  - Detailed station information
  - Power output monitoring
  - Connector type management

- **Interactive Map View**
  - Real-time station locations
  - Status-based marker colors
  - Detailed station information on click
  - Responsive design

- **Responsive Dashboard**
  - Station statistics
  - Status overview
  - Quick actions
  - Dark mode support

## 🏗️ Project Structure

```
evoltsoft/
├── frontend/                # Vue.js frontend application
│   ├── src/
│   │   ├── assets/         # Static assets
│   │   ├── components/     # Reusable components
│   │   ├── stores/         # Pinia stores
│   │   ├── views/          # Page components
│   │   ├── router/         # Vue Router configuration
│   │   └── App.vue         # Root component
│   ├── package.json        # Frontend dependencies
│   └── vite.config.ts      # Vite configuration
│
└── backend/                # Node.js backend application
    ├── src/
    │   ├── controllers/    # Route controllers
    │   ├── models/         # Database models
    │   ├── routes/         # API routes
    │   ├── middleware/     # Custom middleware
    │   └── config/         # Configuration files
    ├── package.json        # Backend dependencies
    └── .env               # Environment variables
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/evoltsoft
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

## 📚 API Documentation

The API documentation is available at `/api-docs` when running the backend server. It provides detailed information about all available endpoints, request/response formats, and authentication requirements.

### Key API Endpoints

- **Authentication**
  - POST `/api/auth/register` - Register new user
  - POST `/api/auth/login` - User login
  - GET `/api/auth/me` - Get current user

- **Stations**
  - GET `/api/stations` - List all stations
  - POST `/api/stations` - Create new station
  - GET `/api/stations/:id` - Get station details
  - PUT `/api/stations/:id` - Update station
  - DELETE `/api/stations/:id` - Delete station

## 🛠️ Technologies Used

### Frontend
- Vue 3
- TypeScript
- Tailwind CSS
- Pinia (State Management)
- Vue Router
- Leaflet (Maps)
- Axios

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT Authentication
- Swagger/OpenAPI

## 🌐 Deployment

### Frontend
The frontend is deployed on Vercel:
[Frontend URL](https://evoltsoft-frontend.vercel.app)

### Backend
The backend is deployed on Render:
[Backend URL](https://evoltsoft-backend.onrender.com)

## 📝 Development Timeline

- **Day 1**: Backend Setup
  - Database schema design
  - CRUD APIs for stations
  - Authentication system
  - API documentation

- **Day 2**: Frontend Foundation
  - Project setup with Vue 3
  - Authentication UI
  - Station listing
  - Basic styling

- **Day 3**: Map Integration
  - Leaflet map implementation
  - Real-time station markers
  - Interactive features
  - API integration

- **Day 4**: Deployment & Testing
  - Frontend deployment
  - Backend deployment
  - End-to-end testing
  - Documentation

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Leaflet for the mapping library
- Tailwind CSS for the styling framework
- Vue.js team for the amazing framework
