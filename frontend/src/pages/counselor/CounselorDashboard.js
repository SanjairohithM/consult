import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, Clock, DollarSign, Users, TrendingUp, Settings, MessageSquare, Video } from 'lucide-react';

export default function CounselorDashboard() {
  const [counselor, setCounselor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [earnings, setEarnings] = useState({ total: 0, thisMonth: 0, thisWeek: 0 });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSessions: 0,
    averageRating: 0,
    totalClients: 0,
    upcomingSessions: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch counselor profile
      const profileRes = await axios.get('/api/auth/me');
      setCounselor(profileRes.data);

      // Fetch appointments
      const appointmentsRes = await axios.get('/api/appointments');
      setAppointments(appointmentsRes.data);

      // Calculate stats
      const upcomingSessions = appointmentsRes.data.filter(apt => 
        new Date(apt.date) > new Date() && apt.status === 'confirmed'
      ).length;

      const completedSessions = appointmentsRes.data.filter(apt => 
        apt.status === 'completed'
      ).length;

      const totalEarnings = completedSessions * (profileRes.data.hourlyRate || 100);
      const thisMonthEarnings = appointmentsRes.data
        .filter(apt => {
          const aptDate = new Date(apt.date);
          const now = new Date();
          return apt.status === 'completed' && 
                 aptDate.getMonth() === now.getMonth() &&
                 aptDate.getFullYear() === now.getFullYear();
        })
        .reduce((sum, apt) => sum + (profileRes.data.hourlyRate || 100), 0);

      setStats({
        totalSessions: completedSessions,
        averageRating: profileRes.data.rating || 0,
        totalClients: new Set(appointmentsRes.data.map(apt => apt.clientId)).size,
        upcomingSessions
      });

      setEarnings({
        total: totalEarnings,
        thisMonth: thisMonthEarnings,
        thisWeek: thisMonthEarnings * 0.25 // Approximate
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleVideoCall = async (appointment) => {
    try {
      // First, create a meeting link if it doesn't exist
      if (!appointment.meetingLink) {
        const meetingRes = await axios.post(`/api/appointments/${appointment._id}/create-meeting`);
        appointment.meetingLink = meetingRes.data.meetingLink;
      }

      // Start the session
      await axios.post(`/api/appointments/${appointment._id}/start-session`);

      // Open Google Meet in a new tab
      window.open(appointment.meetingLink, '_blank');
      
      // Update the appointments list to reflect the new status
      fetchDashboardData();
      
      console.log(`Starting video call for appointment: ${appointment._id}`);
    } catch (error) {
      console.error('Error starting video call:', error);
      alert('Failed to start video call. Please try again.');
    }
  };

  const handleEndSession = async (appointment) => {
    try {
      await axios.post(`/api/appointments/${appointment._id}/end-session`);
      fetchDashboardData();
      console.log(`Session ended for appointment: ${appointment._id}`);
    } catch (error) {
      console.error('Error ending session:', error);
      alert('Failed to end session. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white p-6 rounded-lg shadow h-32"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Counselor Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {counselor?.firstName} {counselor?.lastName}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSessions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageRating.toFixed(1)} ⭐</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Clients</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalClients}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Upcoming Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.upcomingSessions}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Earnings Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Earnings Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-green-600">${earnings.total}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-blue-600">${earnings.thisMonth}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-purple-600">${earnings.thisWeek}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                <Calendar className="h-4 w-4 mr-2" />
                View Schedule
              </button>
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                Messages
              </button>
              <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </button>
            </div>
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Appointments</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Session Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.slice(0, 5).map((appointment) => (
                  <tr key={appointment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {appointment.clientName?.charAt(0) || 'C'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.clientName || 'Client'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointment.clientEmail}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(appointment.date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.time}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 capitalize">
                        {appointment.sessionType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${counselor?.hourlyRate || 100}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {(appointment.status === 'confirmed' || appointment.status === 'scheduled') && appointment.sessionType === 'video' && (
                        <button
                          onClick={() => handleVideoCall(appointment)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                        >
                          <Video className="h-3 w-3 mr-1" />
                          Start Call
                        </button>
                      )}
                      {appointment.status === 'in-progress' && appointment.sessionType === 'video' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => window.open(appointment.meetingLink, '_blank')}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                          >
                            <Video className="h-3 w-3 mr-1" />
                            Join Call
                          </button>
                          <button
                            onClick={() => handleEndSession(appointment)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                          >
                            End Session
                          </button>
                        </div>
                      )}
                      {(appointment.status === 'confirmed' || appointment.status === 'scheduled') && appointment.sessionType !== 'video' && (
                        <span className="text-gray-400 text-xs">In-person</span>
                      )}
                      {appointment.status === 'completed' && (
                        <span className="text-green-600 text-xs">Completed</span>
                      )}
                      {appointment.status === 'cancelled' && (
                        <span className="text-red-600 text-xs">Cancelled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Profile Summary */}
        {counselor && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Personal Information</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Name:</span> {counselor.firstName} {counselor.lastName}</p>
                  <p><span className="font-medium">Email:</span> {counselor.email}</p>
                  <p><span className="font-medium">Phone:</span> {counselor.phone}</p>
                  <p><span className="font-medium">License:</span> {counselor.licenseNumber}</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Professional Details</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Specialization:</span> {counselor.specialization}</p>
                  <p><span className="font-medium">Experience:</span> {counselor.experience}</p>
                  <p><span className="font-medium">Hourly Rate:</span> ${counselor.hourlyRate}</p>
                  <p><span className="font-medium">Rating:</span> {counselor.rating} ⭐</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}