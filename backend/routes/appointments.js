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

    // Try Zoom first, fallback to Google Meet
    const ZOOM_JWT_TOKEN = process.env.ZOOM_JWT_TOKEN;
    console.log('ZOOM_JWT_TOKEN exists:', !!ZOOM_JWT_TOKEN);
    console.log('ZOOM_JWT_TOKEN length:', ZOOM_JWT_TOKEN ? ZOOM_JWT_TOKEN.length : 0);
    
    if (ZOOM_JWT_TOKEN) {
      try {
        console.log('Attempting to create Zoom meeting...');
        console.log('Using JWT token:', ZOOM_JWT_TOKEN.substring(0, 20) + '...');
        
        const zoomRes = await axios.post(
          'https://api.zoom.us/v2/users/me/meetings',
          {
            topic: `Counseling Session - ${appointment.client?.firstName} ${appointment.client?.lastName}`,
            type: 1, // instant meeting
            duration: appointment.duration || 50,
            settings: {
              host_video: true,
              participant_video: true,
              join_before_host: true,
              mute_upon_entry: false,
              watermark: false,
              use_pmi: false,
              approval_type: 0,
              audio: 'both',
              auto_recording: 'none'
            }
          },
          {
            headers: {
              Authorization: `Bearer ${ZOOM_JWT_TOKEN}`,
              'Content-Type': 'application/json',
            },
          }
        );

        console.log('Zoom API response:', zoomRes.data);
        const { join_url, start_url } = zoomRes.data;

        // Save join_url and start_url to appointment
        appointment.meetingLink = join_url;
        appointment.zoomStartUrl = start_url;
        appointment.status = 'confirmed';
        await appointment.save();

        return res.json({
          message: 'Zoom meeting created successfully!',
          join_url,
          start_url,
        });
      } catch (error) {
        console.error('Zoom API error:', error.response?.data || error);
        console.log('Falling back to Google Meet...');
      }
    }
    
    // Fallback to Google Meet
    console.log('Creating Google Meet link...');
    
    // Create a simple meeting link for testing
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const meetingId = `counseling-${timestamp}-${randomId}`;
    const meetingUrl = `https://meet.google.com/${meetingId}`;
    
    // Update appointment with meeting link
    appointment.meetingLink = meetingUrl;
    appointment.zoomStartUrl = meetingUrl;
    appointment.status = 'confirmed';
    await appointment.save();
    
    console.log(`Google Meet link created for appointment ${appointment._id}: ${meetingUrl}`);
    
    return res.json({
      message: 'Google Meet link created successfully (Zoom not configured or failed)',
      join_url: meetingUrl,
      start_url: meetingUrl,
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
