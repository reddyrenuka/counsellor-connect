import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to Counsellor Connect
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Professional counselling services at your convenience
          </p>
          <Link
            href="/login"
            className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-lg font-medium text-lg hover:bg-indigo-700 transition-colors"
          >
            Book an Appointment
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-indigo-600 text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">Personalized Sessions</h3>
            <p className="text-gray-600">
              One-on-one counselling tailored to your needs
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-indigo-600 text-4xl mb-4">📅</div>
            <h3 className="text-xl font-semibold mb-2">Flexible Scheduling</h3>
            <p className="text-gray-600">
              Book appointments at times that work for you
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-indigo-600 text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-2">Confidential & Safe</h3>
            <p className="text-gray-600">
              Your privacy is our top priority
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">About Our Services</h2>
          <p className="text-gray-600 mb-4">
            We provide professional counselling services to help you navigate life&apos;s
            challenges. Our experienced counsellor offers a safe, non-judgmental space
            to explore your thoughts and feelings.
          </p>
          <p className="text-gray-600">
            Whether you&apos;re dealing with stress, relationships, career decisions, or
            personal growth, we&apos;re here to support you on your journey.
          </p>
        </div>
      </div>
    </div>
  );
}
