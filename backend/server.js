const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const http = require("http")
const socketIo = require("socket.io")

// Import routes
const authRoutes = require("./routes/auth")
// const userRoutes = require("./routes/users")
const appointmentRoutes = require("./routes/appointments")
const paymentRoutes = require("./routes/payments")
// const messageRoutes = require("./routes/messages")
// const sessionRoutes = require("./routes/sessions")

dotenv.config()

const app = express()

// Log every request
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// MongoDB Connection
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/counseling-platform"

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error:", err))

// Socket.IO for real-time features
io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  socket.on("join-session", (sessionId) => {
    socket.join(sessionId)
    console.log(`User joined session: ${sessionId}`)
  })

  socket.on("send-message", (data) => {
    socket.to(data.sessionId).emit("receive-message", data)
  })

  socket.on("video-signal", (data) => {
    socket.to(data.sessionId).emit("video-signal", data)
  })

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
  })
})

// Routes
app.use("/api/auth", authRoutes)
// app.use("/api/users", userRoutes)
app.use("/api/appointments", appointmentRoutes)
app.use("/api/payments", paymentRoutes)
// app.use("/api/messages", messageRoutes)
// app.use("/api/sessions", sessionRoutes)

// Public counselors endpoint for booking dropdown
app.get("/api/counselors", async (req, res) => {
  try {
    const User = require("./models/User");
    const counselors = await User.find({ userType: "counselor" }).select(
      "firstName lastName specialization avatar hourlyRate experience bio rating totalSessions availability"
    );
    res.json(counselors);
  } catch (error) {
    console.error("Get counselors error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running!" })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
