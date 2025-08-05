import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/payments', { withCredentials: true })
      .then(res => setPayments(res.data))
      .catch(() => setError('Failed to load payments'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4">Loading payments...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Payment History</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Counselor</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Transaction</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(p => (
            <tr key={p._id}>
              <td className="p-2 border">{new Date(p.createdAt).toLocaleString()}</td>
              <td className="p-2 border">{p.counselor?.firstName} {p.counselor?.lastName}</td>
              <td className="p-2 border">${p.amount}</td>
              <td className="p-2 border">{p.status}</td>
              <td className="p-2 border">{p.transactionId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}