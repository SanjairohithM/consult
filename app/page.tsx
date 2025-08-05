"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, MessageCircle, Calendar, Shield, Star, Users, Clock } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [userType, setUserType] = useState<"client" | "counselor" | null>(null)

  const services = [
    {
      title: "Mental Health Counseling",
      description: "Professional support for anxiety, depression, and mental wellness",
      icon: <Shield className="h-6 w-6" />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Relationship Advice",
      description: "Guidance for couples, family, and interpersonal relationships",
      icon: <Users className="h-6 w-6" />,
      color: "bg-pink-100 text-pink-600",
    },
    {
      title: "Career Counseling",
      description: "Professional development and career transition support",
      icon: <Star className="h-6 w-6" />,
      color: "bg-green-100 text-green-600",
    },
  ]

  const features = [
    {
      title: "Secure Video Calls",
      description: "HIPAA-compliant video sessions with licensed counselors",
      icon: <Video className="h-8 w-8 text-blue-600" />,
    },
    {
      title: "Real-time Chat",
      description: "Instant messaging for quick support between sessions",
      icon: <MessageCircle className="h-8 w-8 text-green-600" />,
    },
    {
      title: "Easy Scheduling",
      description: "Book appointments that fit your schedule",
      icon: <Calendar className="h-8 w-8 text-purple-600" />,
    },
    {
      title: "24/7 Availability",
      description: "Access support whenever you need it most",
      icon: <Clock className="h-8 w-8 text-orange-600" />,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">CounselConnect</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Professional Counseling, <span className="text-blue-600">Anytime, Anywhere</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with licensed counselors through secure video calls, chat, and email. Get the support you need for
            mental health, relationships, and career guidance.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/auth/register?type=client">
              <Button size="lg" className="w-full sm:w-auto">
                Find a Counselor
              </Button>
            </Link>
            <Link href="/auth/register?type=counselor">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                Join as Counselor
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {services.map((service, index) => (
              <Card key={index} className="text-left hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${service.color} flex items-center justify-center mb-4`}>
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need for Online Counseling</h2>
            <p className="text-lg text-gray-600">
              Our platform provides secure, professional tools for effective counseling sessions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Licensed Counselors</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100">Sessions Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-blue-100">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Your Journey?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of people who have found support and guidance through our platform
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="mr-4">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-6 w-6" />
                <span className="text-xl font-bold">CounselConnect</span>
              </div>
              <p className="text-gray-400">
                Professional online counseling platform connecting clients with licensed counselors.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Mental Health</li>
                <li>Relationship Counseling</li>
                <li>Career Guidance</li>
                <li>Family Therapy</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>support@counselconnect.com</li>
                <li>1-800-COUNSEL</li>
                <li>Available 24/7</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CounselConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
