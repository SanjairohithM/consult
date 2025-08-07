"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { Calendar, Video, MessageCircle, Clock, Star, Plus, Search } from "lucide-react"
import ClientLayout from "../../components/ClientLayout"

const ClientDashboard = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const response = await axios.get("/api/appointments")
      setAppointments(response.data)
    } catch (error) {
      console.error("Error fetching appointments:", error)
    } finally {
      setLoading(false)
    }
  }

  const upcomingAppointments = appointments.filter(
    (apt) => (apt.status === "scheduled" || apt.status === "confirmed") && new Date(apt.date) >= new Date(),
  )

  const activeSessions = appointments.filter(
    (apt) => apt.status === "in-progress" && apt.sessionType === "video"
  )

  const recentSessions = appointments.filter((apt) => apt.status === "completed").slice(0, 3)

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </ClientLayout>
    )
  }

  return (
    <ClientLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-2">Welcome back!</h1>
          <p className="text-blue-100">You have {upcomingAppointments.length + activeSessions.length} upcoming appointments and active sessions this week.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/client/book-appointment">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <div className="flex items-center mb-4">
                <Calendar className="h-6 w-6 text-blue-600" />
                <h3 className="ml-2 text-lg font-semibold">Book Appointment</h3>
              </div>
              <p className="text-sm text-gray-600">Schedule a session with a counselor</p>
            </div>
          </Link>

          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <div className="flex items-center mb-4">
              <MessageCircle className="h-6 w-6 text-green-600" />
              <h3 className="ml-2 text-lg font-semibold">Messages</h3>
            </div>
            <p className="text-sm text-gray-600">Chat with your counselors</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <div className="flex items-center mb-4">
              <Search className="h-6 w-6 text-purple-600" />
              <h3 className="ml-2 text-lg font-semibold">Find Counselors</h3>
            </div>
            <p className="text-sm text-gray-600">Browse available counselors</p>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-6">
            <Calendar className="h-5 w-5 mr-2" />
            <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
          </div>

          {upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">
                        {appointment.counselor?.firstName?.[0]}
                        {appointment.counselor?.lastName?.[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        Dr. {appointment.counselor?.firstName} {appointment.counselor?.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">{appointment.counselor?.specialization}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {appointment.sessionType}
                    </span>
                    {appointment.meetingLink && (appointment.meetingLink.includes('zoom.us') || appointment.meetingLink.includes('meet.google.com')) ? (
                      <a 
                        href={appointment.meetingLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`px-4 py-2 rounded-md text-sm inline-flex items-center ${
                          appointment.meetingLink.includes('zoom.us') 
                            ? 'bg-green-600 hover:bg-green-700 text-white' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        <Video className="h-4 w-4 mr-1" />
                        {appointment.meetingLink.includes('zoom.us') ? 'Join Zoom Call' : 'Join Video Call'}
                      </a>
                    ) : (
                      <Link to={`/session/${appointment._id}`}>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">
                          <Video className="h-4 w-4 mr-1 inline" />
                          Join
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No upcoming appointments</p>
              <Link to="/client/book-appointment">
                <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md">
                  <Plus className="h-4 w-4 mr-2 inline" />
                  Book Your First Session
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Active Sessions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-6">
            <Video className="h-5 w-5 mr-2 text-purple-600" />
            <h2 className="text-xl font-semibold">Active Sessions</h2>
          </div>

          {activeSessions.length > 0 ? (
            <div className="space-y-4">
              {activeSessions.map((session) => (
                <div key={session._id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">
                      Dr. {session.counselor?.firstName} {session.counselor?.lastName}
                    </h3>
                    <div className="flex items-center">
                      {session.rating &&
                        [...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < session.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <span>{new Date(session.date).toLocaleDateString()}</span>
                    <span>{session.duration} minutes</span>
                  </div>
                  {session.feedback && <p className="text-sm text-gray-700">{session.feedback}</p>}
                  {session.meetingLink && (session.meetingLink.includes('zoom.us') || session.meetingLink.includes('meet.google.com')) ? (
                    <a 
                      href={session.meetingLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`mt-4 px-4 py-2 rounded-md text-sm inline-flex items-center ${
                        session.meetingLink.includes('zoom.us') 
                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      <Video className="h-4 w-4 mr-1" />
                      {session.meetingLink.includes('zoom.us') ? 'Join Zoom Call' : 'Join Video Call'}
                    </a>
                  ) : (
                    <Link to={`/session/${session._id}`}>
                      <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">
                        <Video className="h-4 w-4 mr-1 inline" />
                        Join
                      </button>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No active sessions</p>
            </div>
          )}
        </div>

        {/* Recent Sessions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Recent Sessions</h2>

          {recentSessions.length > 0 ? (
            <div className="space-y-4">
              {recentSessions.map((session) => (
                <div key={session._id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">
                      Dr. {session.counselor?.firstName} {session.counselor?.lastName}
                    </h3>
                    <div className="flex items-center">
                      {session.rating &&
                        [...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < session.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <span>{new Date(session.date).toLocaleDateString()}</span>
                    <span>{session.duration} minutes</span>
                  </div>
                  {session.feedback && <p className="text-sm text-gray-700">{session.feedback}</p>}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No sessions yet</p>
            </div>
          )}
        </div>
      </div>
    </ClientLayout>
  )
}

export default ClientDashboard
