# Online Counseling Platform

A comprehensive online counseling platform built with React.js frontend and Node.js backend, featuring video call integration with Google Meet.

## 🚀 Features

### For Clients
- **User Registration & Authentication**: Secure login/register system
- **Book Appointments**: Schedule sessions with counselors
- **Payment Integration**: Secure payment processing
- **Video Calls**: Integrated Google Meet video sessions
- **Session Management**: View appointment history and status

### For Counselors
- **Dashboard**: Comprehensive dashboard with statistics
- **Appointment Management**: View and manage client appointments
- **Video Call Integration**: Start/join video sessions via Google Meet
- **Earnings Tracking**: Monitor earnings and session statistics
- **Profile Management**: Update professional information

## 🛠️ Tech Stack

### Frontend
- **React.js**: Modern UI framework
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API calls
- **React Router**: Client-side routing
- **Lucide React**: Beautiful icons

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Token authentication
- **Socket.io**: Real-time communication
- **Nodemon**: Development server with auto-restart

### Database
- **MongoDB Atlas**: Cloud database service

## 📁 Project Structure

```
online-counseling-platform/
├── backend/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Appointment.js
│   │   ├── Message.js
│   │   ├── Payment.js
│   │   └── User.js
│   ├── routes/
│   │   ├── appointments.js
│   │   ├── auth.js
│   │   └── payments.js
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── client/
│   │   │   └── counselor/
│   │   └── App.js
│   └── package.json
├── components/
├── lib/
├── hooks/
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SanjairohithM/consult.git
   cd consult
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   cd ..
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.mongodb.net/counseling-platform
   JWT_SECRET=your-jwt-secret-key
   PORT=5000
   ```

4. **Start the development servers**
   ```bash
   # Start backend server (with nodemon)
   npm run dev
   
   # In a new terminal, start frontend
   cd frontend
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### Appointments
- `GET /api/appointments` - Get user appointments
- `POST /api/appointments` - Create new appointment
- `POST /api/appointments/:id/create-meeting` - Create Google Meet link
- `POST /api/appointments/:id/start-session` - Start video session
- `POST /api/appointments/:id/end-session` - End video session

### Payments
- `GET /api/payments` - Get payment history
- `POST /api/payments` - Process payment

### Counselors
- `GET /api/counselors` - Get all counselors (public)

## 🎥 Video Call Integration

The platform integrates Google Meet for video sessions:

1. **Meeting Creation**: When a counselor clicks "Start Call", the system generates a unique Google Meet link
2. **Session Management**: Tracks session start/end times and status
3. **Meeting Format**: Uses Google Meet's standard format (3 letters + 4 numbers + 3 letters)

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- CORS configuration
- Input validation

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables
2. Deploy to platforms like Heroku, Railway, or Vercel
3. Configure MongoDB Atlas connection

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or GitHub Pages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **SanjairohithM** - Initial work

## 🙏 Acknowledgments

- Google Meet for video call integration
- MongoDB Atlas for database hosting
- React.js and Node.js communities
