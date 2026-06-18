import React, { useState, useEffect } from 'react';
import { FaGraduationCap, FaExternalLinkAlt, FaClock } from 'react-icons/fa';
import { subscribeToScholarships } from '../../firebaseServices';
import { useAuth } from '../../context/AuthContext';

const ScholarshipAlerts = () => {
  const { userProfile } = useAuth();
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToScholarships((data) => {
      setScholarships(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm min-h-[600px]">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-[#032b44]">Undergraduate Scholarships</h2>
        <p className="text-gray-500 text-sm mt-1">Discover financial aid, bursaries, and grants tailored for freshers.</p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500 font-bold">Loading scholarships...</div>
      ) : scholarships.length === 0 ? (
        <div className="text-center py-10 text-gray-500 font-bold">No active scholarships found right now.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scholarships.map(scholarship => {
            
            // Basic eligibility check logic based on userProfile
            let isEligible = true;
            let eligibilityNote = "You meet the basic requirements.";
            
            if (userProfile?.jambScore && userProfile.jambScore < scholarship.minJamb) {
              isEligible = false;
              eligibilityNote = `Requires JAMB score of ${scholarship.minJamb}+`;
            }
            if (scholarship.eligibleCourses?.length > 0 && userProfile?.intendedCourse) {
              const matchesCourse = scholarship.eligibleCourses.some(c => 
                userProfile.intendedCourse.toLowerCase().includes(c.toLowerCase())
              );
              if (!matchesCourse) {
                isEligible = false;
                eligibilityNote = `For specific courses only (e.g. ${scholarship.eligibleCourses[0]})`;
              }
            }

            return (
              <div key={scholarship.id} className="border border-gray-200 rounded-xl p-5 hover:border-[#f1a33b] hover:shadow-md transition flex flex-col h-full">
                <div className="flex justify-between items-start mb-3">
                  <div className="bg-amber-50 text-amber-600 p-2.5 rounded-lg">
                    <FaGraduationCap className="text-xl" />
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                    isEligible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {isEligible ? 'Eligible' : 'Not Eligible'}
                  </span>
                </div>
                
                <h3 className="font-bold text-dark text-lg mb-1">{scholarship.title}</h3>
                <p className="text-sm font-bold text-[#f1a33b] mb-3">{scholarship.provider} • ₦{scholarship.amount.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mb-4 flex-grow">{scholarship.description}</p>
                
                <div className="bg-gray-50 rounded-lg p-3 mb-4 text-xs font-bold text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Deadline:</span>
                    <span className="text-red-500 flex items-center gap-1"><FaClock /> {scholarship.deadline}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Min. JAMB:</span>
                    <span>{scholarship.minJamb}</span>
                  </div>
                  {scholarship.eligibleCourses?.length > 0 && (
                    <div className="flex justify-between mt-1 pt-1 border-t border-gray-200">
                       <span>Target:</span>
                       <span className="text-right truncate w-32">{scholarship.eligibleCourses.join(', ')}</span>
                    </div>
                  )}
                </div>

                {!isEligible && (
                  <p className="text-[10px] text-red-500 font-bold mb-3 italic">{eligibilityNote}</p>
                )}

                <a 
                  href={scholarship.link || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className={`w-full py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition ${
                    isEligible 
                      ? 'bg-[#032b44] text-white hover:bg-[#054a73]' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  onClick={(e) => { if(!isEligible) e.preventDefault(); }}
                >
                  Apply Now <FaExternalLinkAlt />
                </a>
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
};

export default ScholarshipAlerts;
