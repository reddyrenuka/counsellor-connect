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

        {/* Meet Your Counsellor Section */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow-lg p-8 border border-indigo-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Meet Your Counsellor</h2>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Profile Picture */}
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <div className="w-56 h-56 rounded-lg overflow-hidden shadow-md">
                <img
                  src="/images/tanuja-reddy.png"
                  alt="Tanuja Reddy - Professional Counsellor"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Counsellor Info */}
            <div className="flex-grow">
              <h3 className="text-4xl font-bold text-indigo-900 mb-3">Tanuja Reddy</h3>
              <p className="text-xl text-indigo-700 font-medium mb-6">
                M.A. in Psychology | Post Graduate Diploma in Counselling
              </p>
              <div className="space-y-4 mb-8">
                <p className="text-gray-700 leading-relaxed text-lg">
                  Tanuja Reddy is a professional Counsellor and Psychologist who helps individuals find clarity, healing, and direction — whatever life throws their way.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  With an M.A. in Psychology, a Post Graduate Diploma in Counselling, and over a decade of rich, diverse experience — including supporting military personnel and their families — Tanuja brings both expertise and deep human understanding to every conversation.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Her approach is warm, non-judgmental, and entirely centred around you. Whether you&apos;re navigating anxiety, stress, career confusion, relationship challenges, or simply feeling lost — this is a safe space where you are heard, valued, and supported.
                </p>
                <p className="text-gray-700 leading-relaxed font-medium text-lg">
                  Because sometimes, all it takes is the right person to talk to. Tanuja is here. Reach out today.
                </p>
              </div>

              {/* Contact Options */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  Book Appointment
                </Link>
                <a
                  href="https://wa.me/918609051359"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors shadow-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  Chat on WhatsApp
                  <span className="text-sm opacity-90">+91 86090 51359</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
