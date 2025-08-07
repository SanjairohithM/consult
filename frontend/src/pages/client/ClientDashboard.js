"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { Calendar, Video, MessageCircle, Clock, Star, Plus, Search, X, MapPin, Filter } from "lucide-react"
import ClientLayout from "../../components/ClientLayout"

const ClientDashboard = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [counselors, setCounselors] = useState([])
  const [filteredCounselors, setFilteredCounselors] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)

  useEffect(() => {
    fetchAppointments()
  }, [])

  useEffect(() => {
    if (isSearchOpen && counselors.length === 0) {
      fetchCounselors()
    }
  }, [isSearchOpen])

  useEffect(() => {
    // Filter counselors based on search query
    if (searchQuery.trim() === "") {
      setFilteredCounselors(counselors)
    } else {
      const filtered = counselors.filter(counselor =>
        counselor.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        counselor.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        counselor.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        counselor.bio?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredCounselors(filtered)
    }
  }, [searchQuery, counselors])

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

  const fetchCounselors = async () => {
    setSearchLoading(true)
    try {
      const response = await axios.get("/api/counselors")
      setCounselors(response.data)
      setFilteredCounselors(response.data)
    } catch (error) {
      console.error("Error fetching counselors:", error)
    } finally {
      setSearchLoading(false)
    }
  }

  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === "scheduled" && new Date(apt.date) >= new Date(),
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
          <p className="text-blue-100">You have {upcomingAppointments.length} upcoming appointments this week.</p>
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

          <div 
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => setIsSearchOpen(true)}
          >
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
                    <Link to={`/session/${appointment._id}`}>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">
                        <Video className="h-4 w-4 mr-1 inline" />
                        Join
                      </button>
                    </Link>
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

        {/* Search Counselors Modal */}
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900">Find Counselors</h2>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="p-6 border-b bg-gray-50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search by name, specialization, or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Results */}
              <div className="p-6 max-h-96 overflow-y-auto">
                {searchLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredCounselors.length > 0 ? (
                      filteredCounselors.map((counselor) => (
                        <div key={counselor._id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                          <div className="flex items-start space-x-4">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-blue-600 font-semibold text-lg">
                                {counselor.firstName?.[0]}{counselor.lastName?.[0]}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  Dr. {counselor.firstName} {counselor.lastName}
                                </h3>
                                <div className="flex items-center space-x-1">
                                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                  <span className="text-sm text-gray-600">{counselor.rating || 4.5}</span>
                                </div>
                              </div>
                              <p className="text-blue-600 font-medium mb-1">{counselor.specialization}</p>
                              <p className="text-sm text-gray-600 mb-2">{counselor.bio || "Experienced counselor dedicated to helping clients achieve their goals."}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <span>${counselor.hourlyRate || 100}/hour</span>
                                  <span>{counselor.experience || "5+ years"} experience</span>
                                  {counselor.location && (
                                    <div className="flex items-center">
                                      <MapPin className="h-3 w-3 mr-1" />
                                      <span>{counselor.location}</span>
                                    </div>
                                  )}
                                </div>
                                <Link to={`/client/counselor/${counselor._id}`}>
                                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">
                                    View Profile
                                  </button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">
                          {searchQuery ? "No counselors found matching your search." : "Start typing to search for counselors..."}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t bg-gray-50">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    {filteredCounselors.length} counselor{filteredCounselors.length !== 1 ? 's' : ''} found
                  </p>
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ClientLayout>
  )
}

export default ClientDashboard
