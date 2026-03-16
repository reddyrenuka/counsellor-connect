'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Appointment {
  id: string;
  clientEmail: string;
  clientName: string;
  date: string;
  time: string;
  topic: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    checkAuth();
    fetchAppointments();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/session');
      if (!res.ok) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      router.push('/login');
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/appointments/list');
      if (!res.ok) throw new Error('Failed to fetch appointments');
      const data = await res.json();
      setAppointments(data.appointments);
    } catch (err) {
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      const res = await fetch('/api/appointments/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentId }),
      });

      if (!res.ok) throw new Error('Failed to cancel');
      
      fetchAppointments(); // Refresh list
    } catch (err) {
      alert('Failed to cancel appointment');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  const now = new Date();
  const upcoming = appointments.filter(
    (a) => a.status === 'confirmed' && new Date(`${a.date}T${a.time}`) >= now
  );
  const past = appointments.filter(
    (a) => a.status === 'cancelled' || new Date(`${a.date}T${a.time}`) < now
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">Counsellor Connect</h1>
          <div className="flex gap-4 items-center">
            <span className="text-gray-600">Hello, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-800"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">My Dashboard</h2>
          <Link
            href="/book"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Book New Appointment
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-8">
          <div>
            <h3 className="text-2xl font-semibold mb-4">Upcoming Appointments</h3>
            {upcoming.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                No upcoming appointments. Book one to get started!
              </div>
            ) : (
              <div className="grid gap-4">
                {upcoming.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-lg font-semibold text-gray-900">
                          {new Date(`${appointment.date}T${appointment.time}`).toLocaleString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                        <div className="text-gray-600 mt-2">
                          <strong>Topic:</strong> {appointment.topic}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Booked on {new Date(appointment.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <button
                        onClick={() => handleCancelAppointment(appointment.id)}
                        className="text-red-600 hover:text-red-700 font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-4">Past & Cancelled</h3>
            {past.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                No past appointments
              </div>
            ) : (
              <div className="grid gap-4">
                {past.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="bg-white rounded-lg shadow p-6 opacity-60"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-lg font-semibold text-gray-900">
                          {new Date(`${appointment.date}T${appointment.time}`).toLocaleString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                        <div className="text-gray-600 mt-2">
                          <strong>Topic:</strong> {appointment.topic}
                        </div>
                        <span
                          className={`inline-block mt-2 px-3 py-1 rounded text-sm font-medium ${
                            appointment.status === 'cancelled'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {appointment.status === 'cancelled' ? 'Cancelled' : 'Completed'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
