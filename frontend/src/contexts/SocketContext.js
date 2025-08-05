"use client"

import { createContext, useContext, useEffect, useState } from "react"
import io from "socket.io-client"
import { useAuth } from "./AuthContext"

const SocketContext = createContext()

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider")
  }
  return context
}

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      const newSocket = io("http://localhost:5000")

      newSocket.on("connect", () => {
        console.log("Connected to server")
        setConnected(true)
      })

      newSocket.on("disconnect", () => {
        console.log("Disconnected from server")
        setConnected(false)
      })

      setSocket(newSocket)

      return () => {
        newSocket.close()
      }
    }
  }, [user])

  const joinSession = (sessionId) => {
    if (socket) {
      socket.emit("join-session", sessionId)
    }
  }

  const sendMessage = (sessionId, message) => {
    if (socket) {
      socket.emit("send-message", { sessionId, message, sender: user.id })
    }
  }

  const sendVideoSignal = (sessionId, signal) => {
    if (socket) {
      socket.emit("video-signal", { sessionId, signal })
    }
  }

  const value = {
    socket,
    connected,
    joinSession,
    sendMessage,
    sendVideoSignal,
  }

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}
