"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Star, Video, MessageCircle, Mail } from "lucide-react"
import ClientLayout from "@/components/client-layout"

export default function BookAppointmentPage() {
  const [selectedCounselor, setSelectedCounselor] = useState<number | null>(null)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [sessionType, setSessionType] = useState("")
  const [notes, setNotes] = useState("")

  const counselors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialization: "Mental Health",
      experience: "8 years",
      rating: 4.9,
      sessions: 1250,
      bio: "Specializes in anxiety, depression, and stress management with a cognitive-behavioral approach.",
      avatar: "/female-counselor-sarah.png",
      price: 120,
      availability: ["2024-01-15", "2024-01-16", "2024-01-17"],
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialization: "Career Counseling",
      experience: "6 years",
      rating: 4.8,
      sessions: 890,
      bio: "Helps professionals navigate career transitions and workplace challenges.",
      avatar: "/male-counselor-michael.png",
      price: 100,
      availability: ["2024-01-15", "2024-01-18", "2024-01-19"],
    },
    {
      id: 3,
      name: "Dr. Emily Davis",
      specialization: "Relationship Counseling",
      experience: "10 years",
      rating: 4.9,
      sessions: 1580,
      bio: "Expert in couples therapy and family dynamics with over a decade of experience.",
      avatar: "/female-counselor-emily.png",
      price: 140,
      availability: ["2024-01-16", "2024-01-17", "2024-01-20"],
    },
  ]

  const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"]

  const handleBooking = () => {
    if (!selectedCounselor || !selectedDate || !selectedTime || !sessionType) {
      alert("Please fill in all required fields")
      return
    }

    // Mock booking process
    alert("Appointment booked successfully! You will receive a confirmation email shortly.")
  }

  const selectedCounselorData = counselors.find((c) => c.id === selectedCounselor)

  return (
    <ClientLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Book an Appointment</h1>
          <p className="text-gray-600 mt-2">Choose a counselor and schedule your session</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Counselor Selection */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select a Counselor</CardTitle>
                <CardDescription>Choose from our licensed professionals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {counselors.map((counselor) => (
                  <div
                    key={counselor.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedCounselor === counselor.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedCounselor(counselor.id)}
                  >
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={counselor.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {counselor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg">{counselor.name}</h3>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">${counselor.price}/session</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 mb-2">
                          <Badge variant="secondary">{counselor.specialization}</Badge>
                          <span className="text-sm text-gray-600">{counselor.experience} experience</span>
                        </div>
                        <div className="flex items-center space-x-4 mb-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                            <span className="text-sm font-medium">{counselor.rating}</span>
                          </div>
                          <span className="text-sm text-gray-600">{counselor.sessions} sessions completed</span>
                        </div>
                        <p className="text-sm text-gray-700">{counselor.bio}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {selectedCounselorData && (
              <Card>
                <CardHeader>
                  <CardTitle>Session Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Select Date</Label>
                      <Select onValueChange={setSelectedDate}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a date" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedCounselorData.availability.map((date) => (
                            <SelectItem key={date} value={date}>
                              {new Date(date).toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time">Select Time</Label>
                      <Select onValueChange={setSelectedTime}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sessionType">Session Type</Label>
                    <Select onValueChange={setSessionType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose session type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">
                          <div className="flex items-center">
                            <Video className="h-4 w-4 mr-2" />
                            Video Call
                          </div>
                        </SelectItem>
                        <SelectItem value="chat">
                          <div className="flex items-center">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Chat Session
                          </div>
                        </SelectItem>
                        <SelectItem value="email">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2" />
                            Email Consultation
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Session Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="What would you like to discuss in this session?"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Booking Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedCounselorData ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={selectedCounselorData.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {selectedCounselorData.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{selectedCounselorData.name}</h3>
                        <p className="text-sm text-gray-600">{selectedCounselorData.specialization}</p>
                      </div>
                    </div>

                    {selectedDate && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          {new Date(selectedDate).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    )}

                    {selectedTime && (
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{selectedTime}</span>
                      </div>
                    )}

                    {sessionType && (
                      <div className="flex items-center space-x-2">
                        {sessionType === "video" && <Video className="h-4 w-4 text-gray-400" />}
                        {sessionType === "chat" && <MessageCircle className="h-4 w-4 text-gray-400" />}
                        {sessionType === "email" && <Mail className="h-4 w-4 text-gray-400" />}
                        <span className="text-sm capitalize">{sessionType} Session</span>
                      </div>
                    )}

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total:</span>
                        <span className="text-lg font-bold text-green-600">${selectedCounselorData.price}</span>
                      </div>
                    </div>

                    <Button onClick={handleBooking} className="w-full" size="lg">
                      Book Appointment
                    </Button>
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-8">Select a counselor to see booking details</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Booking Policy</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-gray-600 space-y-2">
                <p>• Sessions can be cancelled up to 24 hours in advance</p>
                <p>• Late cancellations may incur a fee</p>
                <p>• All sessions are confidential and secure</p>
                <p>• Payment is processed after session completion</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ClientLayout>
  )
}
