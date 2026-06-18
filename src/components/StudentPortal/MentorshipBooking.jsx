import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaClock, FaCheckCircle, FaStar, FaVideo } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { getTutors, bookConsultation, getUserBookings, subscribeTutors } from '../../firebaseServices';

const MentorshipBooking = () => {
  const { currentUser, userProfile } = useAuth();
  const [tutors, setTutors] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  
  const [isBooking, setIsBooking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      if (currentUser) {
        const b = await getUserBookings(currentUser.uid);
        setMyBookings(b);
      }
    };
    
    const unsubscribe = subscribeTutors((data) => {
      setTutors(data);
      setLoading(false);
    });

    fetchBookings();
    return () => unsubscribe();
  }, [currentUser]);

  const handleBook = async () => {
    if (!selectedTutor || !selectedDate || !selectedTime || !currentUser) return;
    setIsBooking(true);
    
    const payload = {
      tutorId: selectedTutor.id,
      tutorName: selectedTutor.name,
      tutorUniversity: selectedTutor.university,
      studentUid: currentUser.uid,
      studentName: userProfile.displayName,
      date: selectedDate,
      time: selectedTime,
    };
    
    const newBooking = await bookConsultation(payload);
    
    setMyBookings(prev => [newBooking, ...prev]);
    setIsBooking(false);
    setShowSuccess(true);
    setSelectedTutor(null);
    setSelectedDate('');
    setSelectedTime('');
    
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm min-h-[600px]">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-[#032b44]">1-on-1 Mentorship</h2>
        <p className="text-gray-500 text-sm mt-1">Book a free 15-minute consultation with a top student from your dream school.</p>
      </div>

      {showSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl mb-6 font-bold flex items-center gap-2 animate-fadeIn">
          <FaCheckCircle className="text-xl" /> Session successfully booked! Check your upcoming sessions.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Book a session */}
        <div className="space-y-4">
          <h3 className="font-bold text-dark border-b pb-2">Available Mentors</h3>
          {loading ? (
            <div className="text-center py-4 text-gray-500 font-bold">Loading mentors...</div>
          ) : tutors.length === 0 ? (
            <div className="text-center py-4 text-gray-500 font-bold">No mentors currently available.</div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {tutors.map(tutor => (
                <div 
                  key={tutor.id} 
                  onClick={() => setSelectedTutor(tutor)}
                  className={`border rounded-xl p-4 cursor-pointer transition ${
                    selectedTutor?.id === tutor.id ? 'border-[#032b44] bg-[#032b44]/5' : 'border-gray-200 hover:border-[#f1a33b]'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-dark">{tutor.name}</h4>
                      <p className="text-[10px] font-bold text-[#f1a33b] uppercase mt-0.5">{tutor.university} • {tutor.course}</p>
                      <p className="text-xs text-gray-500 mt-2">{tutor.bio}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded">
                      <FaStar /> {tutor.rating}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedTutor && (
            <div className="mt-6 bg-gray-50 p-4 rounded-xl border border-gray-200 animate-fadeIn">
              <h4 className="font-bold text-sm mb-3">Schedule with {selectedTutor.name.split(' ')[0]}</h4>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Date</label>
                  <input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-2 border rounded-lg text-sm bg-white focus:outline-none focus:border-[#032b44]"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Time (15m slot)</label>
                  <select 
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full p-2 border rounded-lg text-sm bg-white focus:outline-none focus:border-[#032b44]"
                  >
                    <option value="">Select Time</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="14:30">02:30 PM</option>
                    <option value="15:00">03:00 PM</option>
                    <option value="16:15">04:15 PM</option>
                  </select>
                </div>
              </div>
              <button 
                onClick={handleBook}
                disabled={!selectedDate || !selectedTime || isBooking}
                className="w-full bg-[#032b44] text-white font-bold py-2.5 rounded-lg disabled:opacity-50 hover:bg-[#054a73] transition"
              >
                {isBooking ? 'Confirming...' : 'Confirm Booking'}
              </button>
            </div>
          )}
        </div>

        {/* Right: My Sessions */}
        <div>
          <h3 className="font-bold text-dark border-b pb-2 mb-4">My Upcoming Sessions</h3>
          <div className="space-y-3">
            {myBookings.map(booking => (
              <div key={booking.id} className="bg-white border-l-4 border-l-[#f1a33b] border-y border-r border-gray-200 rounded-r-xl p-4 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-sm text-dark">{booking.tutorName}</h4>
                  <span className={`text-[9px] font-bold uppercase px-2 py-1 rounded-full ${
                    booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {booking.status}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-3">{booking.tutorUniversity}</p>
                <div className="flex items-center gap-4 text-xs font-bold text-[#032b44]">
                  <span className="flex items-center gap-1.5"><FaCalendarAlt /> {booking.date}</span>
                  <span className="flex items-center gap-1.5"><FaClock /> {booking.time}</span>
                </div>
                <button className="w-full mt-3 flex items-center justify-center gap-2 bg-[#032b44]/5 text-[#032b44] hover:bg-[#032b44] hover:text-white py-2 rounded-lg text-xs font-bold transition">
                  <FaVideo /> Join Google Meet Room
                </button>
              </div>
            ))}
            {myBookings.length === 0 && (
              <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-200 border-dashed">
                <p className="text-xs font-bold text-gray-400">No upcoming sessions.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default MentorshipBooking;
