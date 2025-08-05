"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Video, MessageCircle, Clock, Star, Plus, Search } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import ClientLayout from "@/components/client-layout"

export default function ClientDashboard() {
  const router = useRouter()
  const [upcomingAppointments, setUpcomingAppointments] = useState([
    {
      id: 1,
      counselor: "Dr. Sarah Johnson",
      specialization: "Mental Health",
      date: "2024-01-15",
      time: "2:00 PM",
      type: "Video Call",
      avatar: "/female-counselor.png",
    },
    {
      id: 2,
      counselor: "Dr. Michael Chen",
      specialization: "Career Counseling",
      date: "2024-01-18",
      time: "10:00 AM",
      type: "Video Call",
      avatar: "/male-counselor.png",
    },
  ])

  const [recentSessions, setRecentSessions] = useState([
    {
      id: 1,
      counselor: "Dr. Emily Davis",
      date: "2024-01-10",
      duration: "50 minutes",
      rating: 5,
      notes: "Great session on anxiety management techniques",
    },
    {
      id: 2,
      counselor: "Dr. Robert Wilson",
      date: "2024-01-08",
      duration: "45 minutes",
      rating: 4,
      notes: "Helpful discussion about work-life balance",
    },
  ])

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    const userType = localStorage.getItem("userType")

    if (!isAuthenticated || userType !== "client") {
      router.push("/auth/login")
    }
  }, [router])

  return (
    <ClientLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-2">Welcome back, John!</h1>
          <p className="text-blue-100">You have {upcomingAppointments.length} upcoming appointments this week.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/client/book-appointment">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Calendar className="h-6 w-6 text-blue-600" />
                <CardTitle className="ml-2">Book Appointment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Schedule a session with a counselor</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/client/messages">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <MessageCircle className="h-6 w-6 text-green-600" />
                <CardTitle className="ml-2">Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Chat with your counselors</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/client/find-counselors">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Search className="h-6 w-6 text-purple-600" />
                <CardTitle className="ml-2">Find Counselors</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Browse available counselors</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={appointment.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {appointment.counselor
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{appointment.counselor}</h3>
                        <p className="text-sm text-gray-600">{appointment.specialization}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {appointment.date} at {appointment.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{appointment.type}</Badge>
                      <Link href={`/client/session/${appointment.id}`}>
                        <Button size="sm">
                          <Video className="h-4 w-4 mr-1" />
                          Join
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No upcoming appointments</p>
                <Link href="/client/book-appointment">
                  <Button className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Book Your First Session
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
            <CardDescription>Your past counseling sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {recentSessions.length > 0 ? (
              <div className="space-y-4">
                {recentSessions.map((session) => (
                  <div key={session.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{session.counselor}</h3>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
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
                      <span>{session.date}</span>
                      <span>{session.duration}</span>
                    </div>
                    <p className="text-sm text-gray-700">{session.notes}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No sessions yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  )
}
