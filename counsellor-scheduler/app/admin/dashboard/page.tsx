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
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAuth();
    fetchAppointments();
  }, []);

  const checkAdminAuth = async () => {
    try {
      const res = await fetch('/api/auth/session');
      if (!res.ok) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      if (!data.isAdmin) {
        router.push('/dashboard');
        return;
      }
      setUser(data.user);
    } catch (err) {
      router.push('/login');
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/appointments/list');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setAppointments(data.appointments);
    } catch (err) {
      console.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const todayAppointments = appointments.filter(
    (a) => a.status === 'confirmed' && a.date === today
  );
  const upcomingAppointments = appointments.filter(
    (a) => a.status === 'confirmed' && a.date > today
  );
  const totalConfirmed = appointments.filter((a) => a.status === 'confirmed').length;
  const totalCancelled = appointments.filter((a) => a.status === 'cancelled').length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-indigo-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <div className="flex gap-6 items-center">
              <Link href="/admin/slots" className="hover:text-indigo-200">
                Manage Slots
              </Link>
              <Link href="/admin/appointments" className="hover:text-indigo-200">
                All Appointments
              </Link>
              <button onClick={handleLogout} className="hover:text-indigo-200">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {user?.name}
          </h2>
          <p className="text-gray-600">Counsellor Admin Portal</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-indigo-600 mb-2">
              {todayAppointments.length}
            </div>
            <div className="text-gray-600">Today's Sessions</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {upcomingAppointments.length}
            </div>
            <div className="text-gray-600">Upcoming</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {totalConfirmed}
            </div>
            <div className="text-gray-600">Total Confirmed</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {totalCancelled}
            </div>
            <div className="text-gray-600">Cancelled</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-2xl font-semibold mb-4">Today's Appointments</h3>
          {todayAppointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No appointments scheduled for today
            </div>
          ) : (
            <div className="space-y-4">
              {todayAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between">
                    <div>
                      <div className="font-semibold text-lg">
                        {appointment.time} - {appointment.clientName}
                      </div>
                      <div className="text-gray-600 text-sm">
                        {appointment.clientEmail}
                      </div>
                      <div className="text-gray-700 mt-2">
                        <strong>Topic:</strong> {appointment.topic}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-3 py-1 rounded bg-green-100 text-green-700 text-sm font-medium">
                        Confirmed
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href="/admin/slots"
            className="block bg-indigo-600 text-white rounded-lg shadow p-8 hover:bg-indigo-700 transition-colors"
          >
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-2xl font-semibold mb-2">Manage Availability</h3>
            <p className="text-indigo-100">
              Add or remove time slots for client bookings
            </p>
          </Link>
          <Link
            href="/admin/appointments"
            className="block bg-blue-600 text-white rounded-lg shadow p-8 hover:bg-blue-700 transition-colors"
          >
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-2xl font-semibold mb-2">View All Appointments</h3>
            <p className="text-blue-100">
              Manage and review all appointment bookings
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
