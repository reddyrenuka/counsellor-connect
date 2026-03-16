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
        {/* Your Counsellor Section */}
        <div className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow-lg p-8 border border-indigo-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Counsellor</h2>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Profile Picture Placeholder */}
            <div className="flex-shrink-0">
              <div className="w-48 h-48 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-lg flex items-center justify-center shadow-md">
                <div className="text-center text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <p className="text-sm">Photo</p>
                </div>
              </div>
            </div>

            {/* Counsellor Info */}
            <div className="flex-grow">
              <h3 className="text-3xl font-bold text-indigo-900 mb-2">Tanuja Reddy</h3>
              <p className="text-lg text-indigo-700 font-medium mb-4">
                M.A. in Psychology | Post Graduate Diploma in Counselling
              </p>
              <div className="prose prose-gray max-w-none mb-6">
                <p className="text-gray-700 leading-relaxed">
                  Tanuja Reddy is a professional Counsellor and Psychologist who helps individuals find clarity, healing, and direction — whatever life throws their way.
                </p>
                <p className="text-gray-700 leading-relaxed mt-3">
                  With an M.A. in Psychology, a Post Graduate Diploma in Counselling, and over a decade of rich, diverse experience — including supporting military personnel and their families — Tanuja brings both expertise and deep human understanding to every conversation.
                </p>
                <p className="text-gray-700 leading-relaxed mt-3">
                  Her approach is warm, non-judgmental, and entirely centred around you. Whether you're navigating anxiety, stress, career confusion, relationship challenges, or simply feeling lost — this is a safe space where you are heard, valued, and supported.
                </p>
                <p className="text-gray-700 leading-relaxed mt-3 font-medium">
                  Because sometimes, all it takes is the right person to talk to. Tanuja is here. Reach out today.
                </p>
              </div>

              {/* WhatsApp Contact */}
              <a
                href="https://wa.me/918609051359"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>Chat on WhatsApp</span>
                <span className="text-sm opacity-90">+91 86090 51359</span>
              </a>
            </div>
          </div>
        </div>

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
