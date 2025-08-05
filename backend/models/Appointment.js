const mongoose = require("mongoose")

const appointmentSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    counselor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      default: 50, // minutes
    },
    sessionType: {
      type: String,
      enum: ["video", "chat", "email"],
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "confirmed", "in-progress", "completed", "cancelled"],
      default: "scheduled",
    },
    notes: {
      type: String,
      default: "",
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
    },
    sessionNotes: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    feedback: {
      type: String,
      default: "",
    },
    // Google Meet integration fields
    meetingLink: {
      type: String,
      default: "",
    },
    meetingId: {
      type: String,
      default: "",
    },
    sessionStartTime: {
      type: Date,
    },
    sessionEndTime: {
      type: Date,
    },
    sessionDuration: {
      type: Number, // in minutes
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Appointment", appointmentSchema)
