"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Video, MessageCircle, Clock, Users, DollarSign, FileText } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import CounselorLayout from "@/components/counselor-layout"

export default function CounselorDashboard() {
  const router = useRouter()
  const [todayAppointments, setTodayAppointments] = useState([
    {
      id: 1,
      client: "John Smith",
      time: "10:00 AM",
      type: "Video Call",
      status: "upcoming",
      avatar: "/diverse-male-client.png",
    },
    {
      id: 2,
      client: "Sarah Wilson",
      time: "2:00 PM",
      type: "Video Call",
      status: "upcoming",
      avatar: "/diverse-female-client.png",
    },
    {
      id: 3,
      client: "Mike Johnson",
      time: "4:00 PM",
      type: "Chat Session",
      status: "completed",
      avatar: "/male-client-mike.png",
    },
  ])

  const [stats, setStats] = useState({
    totalClients: 45,
    sessionsThisWeek: 18,
    monthlyEarnings: 3240,
    averageRating: 4.8,
  })

  const [recentMessages, setRecentMessages] = useState([
    {
      id: 1,
      client: "Emma Davis",
      message: "Thank you for the session yesterday. I feel much better.",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      client: "Robert Chen",
      message: "Can we reschedule our appointment for tomorrow?",
      time: "4 hours ago",
      unread: true,
    },
    {
      id: 3,
      client: "Lisa Anderson",
      message: "The techniques you shared are really helping.",
      time: "1 day ago",
      unread: false,
    },
  ])

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    const userType = localStorage.getItem("userType")

    if (!isAuthenticated || userType !== "counselor") {
      router.push("/auth/login")
    }
  }, [router])

  const upcomingAppointments = todayAppointments.filter((apt) => apt.status === "upcoming")

  return (
    <CounselorLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-2">Good morning, Dr. Johnson!</h1>
          <p className="text-green-100">You have {upcomingAppointments.length} appointments scheduled for today.</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClients}</div>
              <p className="text-xs text-muted-foreground">+3 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sessions This Week</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.sessionsThisWeek}</div>
              <p className="text-xs text-muted-foreground">+2 from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.monthlyEarnings}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <div className="text-yellow-400">★</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageRating}</div>
              <p className="text-xs text-muted-foreground">Based on 127 reviews</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/counselor/schedule">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Calendar className="h-6 w-6 text-blue-600" />
                <CardTitle className="ml-2">Manage Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Set availability and manage appointments</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/counselor/clients">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Users className="h-6 w-6 text-green-600" />
                <CardTitle className="ml-2">Client Records</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">View and manage client information</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/counselor/notes">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <FileText className="h-6 w-6 text-purple-600" />
                <CardTitle className="ml-2">Session Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Create and manage session notes</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Today's Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Today's Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todayAppointments.length > 0 ? (
                <div className="space-y-4">
                  {todayAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={appointment.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {appointment.client
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{appointment.client}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{appointment.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={appointment.status === "completed" ? "secondary" : "default"}>
                          {appointment.status}
                        </Badge>
                        {appointment.status === "upcoming" && (
                          <Link href={`/counselor/session/${appointment.id}`}>
                            <Button size="sm">
                              <Video className="h-4 w-4 mr-1" />
                              Join
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No appointments scheduled for today</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Messages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                Recent Messages
              </CardTitle>
              <CardDescription>Messages from your clients</CardDescription>
            </CardHeader>
            <CardContent>
              {recentMessages.length > 0 ? (
                <div className="space-y-4">
                  {recentMessages.map((message) => (
                    <div key={message.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{message.client}</h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">{message.time}</span>
                          {message.unread && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{message.message}</p>
                    </div>
                  ))}
                  <Link href="/counselor/messages">
                    <Button variant="outline" className="w-full bg-transparent">
                      View All Messages
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No recent messages</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </CounselorLayout>
  )
}
