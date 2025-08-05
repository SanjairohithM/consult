import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function BookAppointment() {
  const [counselors, setCounselors] = useState([]);
  const [form, setForm] = useState({
    counselorId: '',
    date: '',
    time: '',
    sessionType: 'video',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch counselors (using public endpoint)
    axios.get('/api/counselors')
      .then(res => setCounselors(res.data))
      .catch(() => setCounselors([]));
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await axios.post('/api/appointments', form, { withCredentials: true });
      setMessage(res.data.message || 'Appointment booked!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Booking failed');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Book Appointment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Counselor</label>
          <select name="counselorId" value={form.counselorId} onChange={handleChange} required className="w-full border rounded p-2">
            <option value="">Select a counselor</option>
            {counselors.map(c => (
              <option key={c._id} value={c._id}>{c.firstName} {c.lastName} ({c.specialization})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Date</label>
          <input type="date" name="date" value={form.date} onChange={handleChange} required className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block mb-1">Time</label>
          <input type="time" name="time" value={form.time} onChange={handleChange} required className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block mb-1">Session Type</label>
          <select name="sessionType" value={form.sessionType} onChange={handleChange} className="w-full border rounded p-2">
            <option value="video">Video</option>
            <option value="chat">Chat</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Notes</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? 'Booking...' : 'Book Appointment'}
        </button>
      </form>
      {message && <div className="mt-4 text-center text-green-600">{message}</div>}
    </div>
  );
}