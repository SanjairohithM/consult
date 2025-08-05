const express = require("express")
const Appointment = require("../models/Appointment")
const User = require("../models/User")
const auth = require("../middleware/auth")

const router = express.Router()

// Get all appointments for a user
router.get("/", auth, async (req, res) => {
  try {
    const { userType, userId } = req.user
    let appointments

    if (userType === "client") {
      appointments = await Appointment.find({ client: userId })
        .populate("counselor", "firstName lastName specialization avatar")
        .sort({ date: -1 })
    } else {
      appointments = await Appointment.find({ counselor: userId })
        .populate("client", "firstName lastName avatar")
        .sort({ date: -1 })
    }

    res.json(appointments)
  } catch (error) {
    console.error("Get appointments error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create new appointment
router.post("/", auth, async (req, res) => {
  try {
    const { counselorId, date, time, sessionType, notes } = req.body
    const clientId = req.user.userId

    // Get counselor details for pricing
    const counselor = await User.findById(counselorId)
    if (!counselor || counselor.userType !== "counselor") {
      return res.status(404).json({ message: "Counselor not found" })
    }

    // Create appointment
    const appointment = new Appointment({
      client: clientId,
      counselor: counselorId,
      date: new Date(date),
      time,
      sessionType,
      notes,
      amount: counselor.hourlyRate,
    })

    await appointment.save()

    // Populate the appointment with user details
    await appointment.populate("counselor", "firstName lastName specialization")

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment,
    })
  } catch (error) {
    console.error("Create appointment error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create Google Meet link for video session
router.post("/:id/create-meeting", auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Generate unique meeting ID (Google Meet format: 3 letters, 4 numbers, 3 letters)
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    let meetingId = '';
    
    // Generate 3 random letters
    for (let i = 0; i < 3; i++) {
      meetingId += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    
    // Generate 4 random numbers
    for (let i = 0; i < 4; i++) {
      meetingId += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    
    // Generate 3 more random letters
    for (let i = 0; i < 3; i++) {
      meetingId += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    
    const googleMeetUrl = `https://meet.google.com/${meetingId}`;

    // Update appointment with meeting link
    appointment.meetingLink = googleMeetUrl;
    appointment.status = "confirmed";
    await appointment.save();

    res.json({
      message: "Meeting link created successfully",
      meetingLink: googleMeetUrl,
      meetingId: meetingId
    });
  } catch (error) {
    console.error("Create meeting error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Start video session
router.post("/:id/start-session", auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Update appointment status to in-progress
    appointment.status = "in-progress";
    appointment.sessionStartTime = new Date();
    await appointment.save();

    res.json({
      message: "Session started successfully",
      appointment: appointment
    });
  } catch (error) {
    console.error("Start session error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// End video session
router.post("/:id/end-session", auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Update appointment status to completed
    appointment.status = "completed";
    appointment.sessionEndTime = new Date();
    await appointment.save();

    res.json({
      message: "Session ended successfully",
      appointment: appointment
    });
  } catch (error) {
    console.error("End session error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update appointment status
router.patch("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body
    const appointmentId = req.params.id

    const appointment = await Appointment.findById(appointmentId)
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" })
    }

    // Check if user is authorized to update this appointment
    if (appointment.client.toString() !== req.user.userId && appointment.counselor.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" })
    }

    appointment.status = status
    await appointment.save()

    res.json({ message: "Appointment status updated", appointment })
  } catch (error) {
    console.error("Update appointment error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Add session notes (counselor only)
router.patch("/:id/notes", auth, async (req, res) => {
  try {
    const { sessionNotes } = req.body
    const appointmentId = req.params.id

    if (req.user.userType !== "counselor") {
      return res.status(403).json({ message: "Only counselors can add session notes" })
    }

    const appointment = await Appointment.findById(appointmentId)
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" })
    }

    if (appointment.counselor.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" })
    }

    appointment.sessionNotes = sessionNotes
    await appointment.save()

    res.json({ message: "Session notes updated", appointment })
  } catch (error) {
    console.error("Update session notes error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
