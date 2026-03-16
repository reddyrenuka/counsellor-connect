'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Slot {
  slotId: string;
  date: string;
  time: string;
  status: 'available' | 'booked';
  createdAt: string;
}

export default function AdminSlotsPage() {
  const router = useRouter();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [newSlotTime, setNewSlotTime] = useState('09:00');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    checkAdminAuth();
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  }, []);

  useEffect(() => {
    fetchAllSlots();
  }, []);

  const checkAdminAuth = async () => {
    try {
      const res = await fetch('/api/auth/session');
      if (!res.ok || !(await res.json()).isAdmin) {
        router.push('/login');
      }
    } catch (err) {
      router.push('/login');
    }
  };

  const fetchAllSlots = async () => {
    try {
      const res = await fetch('/api/slots/manage');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setSlots(data.slots);
    } catch (err) {
      setError('Failed to load slots');
    }
  };

  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/slots/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operation: 'create',
          date: selectedDate,
          time: newSlotTime,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create slot');
        setLoading(false);
        return;
      }

      setSuccess('Slot created successfully!');
      fetchAllSlots();
      setNewSlotTime('09:00');
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSlot = async (slotId: string) => {
    if (!confirm('Are you sure you want to remove this slot?')) return;

    try {
      const res = await fetch('/api/slots/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operation: 'remove',
          slotId,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to remove slot');
        return;
      }

      setSuccess('Slot removed successfully!');
      fetchAllSlots();
    } catch (err) {
      alert('An error occurred');
    }
  };

  const filteredSlots = slots.filter((slot) => slot.date === selectedDate);
  const sortedSlots = [...filteredSlots].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-indigo-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Manage Availability Slots</h1>
          <Link href="/admin/dashboard" className="hover:text-indigo-200">
            ← Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded text-green-700">
            {success}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-2xl font-semibold mb-6">Create New Slot</h3>
            <form onSubmit={handleCreateSlot} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time (UTC)
                </label>
                <input
                  type="time"
                  value={newSlotTime}
                  onChange={(e) => setNewSlotTime(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Slot'}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-2xl font-semibold mb-6">
              Slots for {new Date(selectedDate).toLocaleDateString()}
            </h3>
            {sortedSlots.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No slots for this date
              </div>
            ) : (
              <div className="space-y-3">
                {sortedSlots.map((slot) => (
                  <div
                    key={slot.slotId}
                    className={`flex justify-between items-center p-4 border rounded-lg ${
                      slot.status === 'booked'
                        ? 'bg-gray-100 border-gray-300'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">
                        {slot.time}
                        {slot.status === 'booked' && (
                          <span className="ml-2 text-xs bg-gray-600 text-white px-2 py-1 rounded">
                            Booked
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        Created: {new Date(slot.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    {slot.status === 'available' && (
                      <button
                        onClick={() => handleRemoveSlot(slot.slotId)}
                        className="text-red-600 hover:text-red-700 font-medium text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-2xl font-semibold mb-6">All Slots Overview</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {slots
                  .sort((a, b) => {
                    const dateCompare = a.date.localeCompare(b.date);
                    return dateCompare !== 0 ? dateCompare : a.time.localeCompare(b.time);
                  })
                  .map((slot) => (
                    <tr key={slot.slotId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {new Date(slot.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {slot.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            slot.status === 'available'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {slot.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {slot.status === 'available' ? (
                          <button
                            onClick={() => handleRemoveSlot(slot.slotId)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>
                        ) : (
                          <span className="text-gray-400">Cannot remove</span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
