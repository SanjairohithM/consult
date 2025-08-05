"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Video, VideoOff, Mic, MicOff, Phone, MessageCircle, Settings, Camera } from "lucide-react"
import ClientLayout from "@/components/client-layout"

export default function SessionPage({ params }: { params: { id: string } }) {
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [sessionTime, setSessionTime] = useState(0)
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: "Dr. Sarah Johnson",
      message: "Hello! I'm ready to start our session. How are you feeling today?",
      timestamp: new Date().toLocaleTimeString(),
      isClient: false,
    },
  ])
  const [newMessage, setNewMessage] = useState("")

  // Mock session data
  const sessionData = {
    counselor: "Dr. Sarah Johnson",
    specialization: "Mental Health",
    avatar: "/female-counselor-session.png",
    sessionType: "Video Call",
    scheduledTime: "2:00 PM - 2:50 PM",
  }

  useEffect(() => {
    // Simulate connection after 2 seconds
    const timer = setTimeout(() => {
      setIsConnected(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Session timer
    let interval: NodeJS.Timeout
    if (isConnected) {
      interval = setInterval(() => {
        setSessionTime((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isConnected])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages([
        ...chatMessages,
        {
          id: chatMessages.length + 1,
          sender: "You",
          message: newMessage,
          timestamp: new Date().toLocaleTimeString(),
          isClient: true,
        },
      ])
      setNewMessage("")
    }
  }

  const handleEndSession = () => {
    if (confirm("Are you sure you want to end this session?")) {
      // In a real app, this would handle session cleanup
      alert("Session ended. You will be redirected to provide feedback.")
    }
  }

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Session Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={sessionData.avatar || "/placeholder.svg"} />
                  <AvatarFallback>SJ</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-xl font-bold">{sessionData.counselor}</h1>
                  <p className="text-gray-600">{sessionData.specialization}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant={isConnected ? "default" : "secondary"}>
                  {isConnected ? "Connected" : "Connecting..."}
                </Badge>
                <p className="text-sm text-gray-600 mt-1">{sessionData.scheduledTime}</p>
                {isConnected && (
                  <p className="text-sm font-mono text-blue-600">Session Time: {formatTime(sessionTime)}</p>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Call Area */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ aspectRatio: "16/9" }}>
                  {/* Counselor Video */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {isConnected ? (
                      <div className="text-center text-white">
                        <Avatar className="h-32 w-32 mx-auto mb-4">
                          <AvatarImage src={sessionData.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-2xl">SJ</AvatarFallback>
                        </Avatar>
                        <p className="text-lg">{sessionData.counselor}</p>
                        <p className="text-sm text-gray-300">Video call in progress</p>
                      </div>
                    ) : (
                      <div className="text-center text-white">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                        <p>Connecting to session...</p>
                      </div>
                    )}
                  </div>

                  {/* Client Video (Picture-in-Picture) */}
                  <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-800 rounded-lg border-2 border-white overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center text-white">
                      {isVideoOn ? (
                        <div className="text-center">
                          <Camera className="h-6 w-6 mx-auto mb-1" />
                          <p className="text-xs">You</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <VideoOff className="h-6 w-6 mx-auto mb-1" />
                          <p className="text-xs">Camera Off</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="flex items-center space-x-4 bg-black bg-opacity-50 rounded-full px-6 py-3">
                      <Button
                        size="sm"
                        variant={isAudioOn ? "default" : "destructive"}
                        className="rounded-full w-12 h-12"
                        onClick={() => setIsAudioOn(!isAudioOn)}
                      >
                        {isAudioOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                      </Button>

                      <Button
                        size="sm"
                        variant={isVideoOn ? "default" : "destructive"}
                        className="rounded-full w-12 h-12"
                        onClick={() => setIsVideoOn(!isVideoOn)}
                      >
                        {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                      </Button>

                      <Button size="sm" variant="outline" className="rounded-full w-12 h-12 bg-transparent">
                        <Settings className="h-4 w-4" />
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        className="rounded-full w-12 h-12"
                        onClick={handleEndSession}
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Panel */}
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Session Chat
                </CardTitle>
                <CardDescription>Send messages during your session</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col h-96">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                  {chatMessages.map((message) => (
                    <div key={message.id} className={`flex ${message.isClient ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-xs px-3 py-2 rounded-lg ${
                          message.isClient ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p className={`text-xs mt-1 ${message.isClient ? "text-blue-100" : "text-gray-500"}`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage} size="sm">
                    Send
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Session Info */}
        <Card>
          <CardHeader>
            <CardTitle>Session Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-semibold text-gray-600">Session Type</p>
                <p>{sessionData.sessionType}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600">Scheduled Time</p>
                <p>{sessionData.scheduledTime}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600">Connection Status</p>
                <p className={isConnected ? "text-green-600" : "text-yellow-600"}>
                  {isConnected ? "Connected" : "Connecting..."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  )
}
