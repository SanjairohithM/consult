const express = require("express")
const Appointment = require("../models/Appointment")
const User = require("../models/User")
const auth = require("../middleware/auth")
const axios = require('axios'); // Ensure axios is required at the top

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

// Create Zoom Meeting for video session
router.post('/:id/create-zoom-meeting', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Only allow if sessionType is video
    if (appointment.sessionType !== 'video') {
      return res.status(400).json({ message: 'Only video sessions can have Zoom meetings' });
    }

    // If already has a meetingLink, return it
    if (appointment.meetingLink && appointment.meetingLink.includes('zoom.us')) {
      return res.json({
        message: 'Zoom meeting already exists',
        join_url: appointment.meetingLink,
        start_url: appointment.zoomStartUrl || '',
      });
    }

    // Create Zoom meeting via Zoom API
    const ZOOM_JWT_TOKEN = process.env.ZOOM_JWT_TOKEN;
    if (!ZOOM_JWT_TOKEN) {
      // Fall back to Google Meet if Zoom is not configured
      console.log('Zoom JWT token not configured, falling back to Google Meet');
      
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
      appointment.zoomStartUrl = googleMeetUrl; // Save the same URL as start_url for Google Meet
      appointment.status = 'confirmed';
      await appointment.save();

      return res.json({
        message: 'Google Meet link created successfully (Zoom not configured)',
        join_url: googleMeetUrl,
        start_url: googleMeetUrl,
      });
    }

    const zoomRes = await axios.post(
      'https://api.zoom.us/v2/users/me/meetings',
      {
        topic: 'Counseling Session',
        type: 1, // instant meeting
      },
      {
        headers: {
          Authorization: `Bearer ${ZOOM_JWT_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const { join_url, start_url } = zoomRes.data;

    // Save join_url and start_url to appointment
    appointment.meetingLink = join_url;
    appointment.zoomStartUrl = start_url; // You may want to add this field to your schema
    appointment.status = 'confirmed';
    await appointment.save();

    res.json({
      message: 'Zoom meeting created successfully',
      join_url,
      start_url,
    });
  } catch (error) {
    console.error('Create Zoom meeting error:', error.response?.data || error);
    res.status(500).json({ message: 'Failed to create Zoom meeting' });
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
