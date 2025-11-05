import { useState } from 'react';
import { Calendar, Video, Phone, MessageSquare, Star, Award, CheckCircle } from 'lucide-react';

interface Therapist {
  id: string;
  name: string;
  title: string;
  specializations: string[];
  rating: number;
  reviewCount: number;
  experience: number;
  sessionTypes: string[];
  rate: number;
  avatar: string;
  nextAvailable: string;
  bio: string;
}

export default function Counseling() {
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [bookingStep, setBookingStep] = useState<'browse' | 'details' | 'schedule'>('browse');

  const therapists: Therapist[] = [
    {
      id: '1',
      name: 'Dr. Emma Williams',
      title: 'Licensed Psychologist',
      specializations: ['Anxiety', 'Depression', 'CBT'],
      rating: 4.9,
      reviewCount: 89,
      experience: 12,
      sessionTypes: ['video', 'phone'],
      rate: 150,
      avatar: '👩‍⚕️',
      nextAvailable: 'Tomorrow at 2:00 PM',
      bio: 'Specializing in evidence-based CBT for anxiety and depression with over 12 years of experience.',
    },
    {
      id: '2',
      name: 'Dr. James Chen',
      title: 'Clinical Psychologist',
      specializations: ['Trauma', 'PTSD', 'Stress'],
      rating: 5.0,
      reviewCount: 124,
      experience: 15,
      sessionTypes: ['video', 'phone', 'chat'],
      rate: 175,
      avatar: '👨‍⚕️',
      nextAvailable: 'Thursday at 10:00 AM',
      bio: 'Trauma-informed care specialist helping clients heal from PTSD and chronic stress.',
    },
    {
      id: '3',
      name: 'Dr. Sarah Martinez',
      title: 'Licensed Therapist',
      specializations: ['Relationships', 'Life Transitions', 'Self-esteem'],
      rating: 4.8,
      reviewCount: 67,
      experience: 8,
      sessionTypes: ['video', 'chat'],
      rate: 120,
      avatar: '👩‍💼',
      nextAvailable: 'Today at 4:00 PM',
      bio: 'Compassionate therapist focused on helping clients navigate life changes and build confidence.',
    },
    {
      id: '4',
      name: 'Dr. Michael Brown',
      title: 'Psychiatrist',
      specializations: ['Medication Management', 'Bipolar', 'Depression'],
      rating: 4.9,
      reviewCount: 156,
      experience: 20,
      sessionTypes: ['video', 'phone'],
      rate: 200,
      avatar: '👨‍⚕️',
      nextAvailable: 'Friday at 9:00 AM',
      bio: 'Board-certified psychiatrist with expertise in medication management and mood disorders.',
    },
  ];

  const upcomingSessions = [
    {
      id: '1',
      therapist: 'Dr. Emma Williams',
      date: 'Tomorrow',
      time: '2:00 PM',
      type: 'video',
      status: 'confirmed',
    },
  ];

  const timeSlots = [
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
    '5:00 PM',
  ];

  const handleBooking = (therapist: Therapist) => {
    setSelectedTherapist(therapist);
    setBookingStep('details');
  };

  if (bookingStep === 'schedule' && selectedTherapist) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setBookingStep('details')}
          className="text-teal-600 hover:text-teal-700 font-semibold"
        >
          ← Back to Details
        </button>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Schedule Your Session</h2>
          <div className="flex gap-6">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 mb-3">Select Date</h3>
              <div className="grid grid-cols-7 gap-2 mb-6">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                  <button
                    key={day}
                    className="p-3 border border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-colors"
                  >
                    <div className="text-xs text-gray-600">{day}</div>
                    <div className="text-lg font-semibold">{15 + idx}</div>
                  </button>
                ))}
              </div>

              <h3 className="font-semibold text-gray-800 mb-3">Available Times</h3>
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    className="p-3 border border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-colors text-center"
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-80">
              <div className="bg-gray-50 rounded-lg p-4 sticky top-6">
                <h3 className="font-semibold text-gray-800 mb-4">Booking Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Therapist</span>
                    <span className="font-semibold">{selectedTherapist.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Session Type</span>
                    <span className="font-semibold">Video Call</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-semibold">60 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date</span>
                    <span className="font-semibold">Select above</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-lg">${selectedTherapist.rate}</span>
                  </div>
                </div>
                <button className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition-colors font-semibold mt-4">
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (bookingStep === 'details' && selectedTherapist) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => {
            setBookingStep('browse');
            setSelectedTherapist(null);
          }}
          className="text-teal-600 hover:text-teal-700 font-semibold"
        >
          ← Back to Therapists
        </button>

        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="flex gap-6">
            <div className="text-8xl">{selectedTherapist.avatar}</div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800">{selectedTherapist.name}</h1>
              <p className="text-gray-600 text-lg mt-1">{selectedTherapist.title}</p>

              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{selectedTherapist.rating}</span>
                  <span className="text-gray-600 text-sm">({selectedTherapist.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-5 h-5 text-teal-600" />
                  <span className="text-gray-600">{selectedTherapist.experience} years exp.</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                {selectedTherapist.specializations.map((spec) => (
                  <span key={spec} className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm">
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-right">
              <div className="text-3xl font-bold text-gray-800">${selectedTherapist.rate}</div>
              <div className="text-gray-600 text-sm">per session</div>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">About</h3>
              <p className="text-gray-700">{selectedTherapist.bio}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Session Types</h3>
              <div className="flex gap-3">
                {selectedTherapist.sessionTypes.includes('video') && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                    <Video className="w-5 h-5 text-gray-600" />
                    <span>Video</span>
                  </div>
                )}
                {selectedTherapist.sessionTypes.includes('phone') && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-600" />
                    <span>Phone</span>
                  </div>
                )}
                {selectedTherapist.sessionTypes.includes('chat') && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-gray-600" />
                    <span>Chat</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Next Available</h3>
              <div className="flex items-center gap-2 text-teal-600">
                <Calendar className="w-5 h-5" />
                <span className="font-semibold">{selectedTherapist.nextAvailable}</span>
              </div>
            </div>

            <button
              onClick={() => setBookingStep('schedule')}
              className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition-colors font-semibold text-lg"
            >
              Book Appointment
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Reviews</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-b border-gray-200 pb-4 last:border-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">2 weeks ago</span>
                </div>
                <p className="text-gray-700 text-sm">
                  Excellent therapist! Very understanding and provided practical strategies that really helped.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Professional Counseling</h1>
        <p className="text-gray-600 mt-1">Connect with licensed therapists</p>
      </div>

      {upcomingSessions.length > 0 && (
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl shadow-lg p-6 text-white">
          <h2 className="text-xl font-bold mb-4">Upcoming Sessions</h2>
          {upcomingSessions.map((session) => (
            <div key={session.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white rounded-full p-3">
                    <Video className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{session.therapist}</p>
                    <p className="text-teal-100 text-sm">
                      {session.date} at {session.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span className="text-sm">Confirmed</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex gap-3 items-center">
          <input
            type="text"
            placeholder="Search by specialization..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
            Search
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {therapists.map((therapist) => (
          <div
            key={therapist.id}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex gap-4">
              <div className="text-6xl">{therapist.avatar}</div>
              <div className="flex-1">
                <h3 className="font-bold text-xl text-gray-800">{therapist.name}</h3>
                <p className="text-gray-600 text-sm">{therapist.title}</p>

                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-sm">{therapist.rating}</span>
                    <span className="text-gray-600 text-xs">({therapist.reviewCount})</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600 text-sm">{therapist.experience} yrs exp.</span>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {therapist.specializations.map((spec) => (
                    <span key={spec} className="px-2 py-1 bg-teal-50 text-teal-700 text-xs rounded-full">
                      {spec}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Next: {therapist.nextAvailable}</span>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="text-2xl font-bold text-gray-800">${therapist.rate}/hr</div>
                  <button
                    onClick={() => handleBooking(therapist)}
                    className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
