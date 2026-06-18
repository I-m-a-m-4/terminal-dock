import React, { useState, useEffect } from 'react';
import { 
  FaUser, FaGraduationCap, FaBell, FaBookOpen, FaComment, 
  FaCalculator, FaSlidersH, FaFileAlt, FaTrophy, FaCalendarCheck 
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import CbtEngine from './CbtEngine';
import VerifiedNews from './VerifiedNews';
import SyllabusTracker from './SyllabusTracker';
import CommunityForum from './CommunityForum';
import MentorshipBooking from './MentorshipBooking';
import AdmissionCalculator from './AdmissionCalculator';
import ScholarshipAlerts from './ScholarshipAlerts';

const PortalDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { userProfile, updateUserProfile } = useAuth();

  const [showConfig, setShowConfig] = useState(false);
  const [tempProfile, setTempProfile] = useState({
    displayName: '',
    targetInstitution: '',
    intendedCourse: '',
    jambScore: 0
  });

  // Sync temp profile with actual user profile from Firestore when available
  useEffect(() => {
    if (userProfile) {
      setTempProfile({
        displayName: userProfile.displayName || '',
        targetInstitution: userProfile.targetInstitution || '',
        intendedCourse: userProfile.intendedCourse || '',
        jambScore: userProfile.jambScore || 0
      });
    }
  }, [userProfile]);

  const handleFormSave = async (e) => {
    e.preventDefault();
    await updateUserProfile(tempProfile);
    setShowConfig(false);
  };

  if (!userProfile) return <div className="min-h-screen flex items-center justify-center">Loading Profile...</div>;

  return (
    <div className="bg-gray-50 min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        {/* Main Grid: Left Navigation Shell / Right Main Window */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          
          {/* 1. LEFT SIDEBAR PANEL: Profile & Navigation */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Glassmorphic User Profile Card */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-150 p-5 text-center relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#032b44] to-[#f1a33b]" />
              <div className="w-16 h-16 bg-[#032b44] text-white font-extrabold text-2xl rounded-full flex items-center justify-center mx-auto mt-2 shadow-inner">
                {userProfile.displayName ? userProfile.displayName[0].toUpperCase() : 'U'}
              </div>
              <h3 className="font-bold text-dark text-lg mt-3">{userProfile.displayName || 'Student'}</h3>
              {userProfile.intendedCourse && (
                 <span className="inline-block bg-[#032b44]/10 text-[#032b44] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full mt-1.5 uppercase">
                   {userProfile.intendedCourse} Aspirant
                 </span>
              )}
             
              <div className="mt-4 pt-3.5 border-t border-gray-100 grid grid-cols-2 gap-2 text-center text-xs">
                <div>
                  <span className="block text-gray-400 font-semibold uppercase text-[9px]">Target</span>
                  <span className="font-bold text-[#032b44]">{userProfile.targetInstitution || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-gray-400 font-semibold uppercase text-[9px]">UTME Score</span>
                  <span className="font-bold text-[#032b44]">{userProfile.jambScore || 0} / 400</span>
                </div>
              </div>

              {/* Personalize Button */}
              <button 
                onClick={() => setShowConfig(!showConfig)}
                className="w-full mt-4 py-2 border border-gray-200 hover:bg-[#032b44] hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <FaSlidersH /> Customize Profile
              </button>
            </div>

            {/* Profile configuration Form */}
            {showConfig && (
              <form onSubmit={handleFormSave} className="bg-white border rounded-2xl p-5 shadow-sm space-y-3.5 animate-fadeIn">
                <h4 className="font-bold text-[#032b44] text-sm">Configure Personal Details</h4>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Your Name</label>
                  <input
                    type="text"
                    value={tempProfile.displayName}
                    onChange={(e) => setTempProfile(prev => ({ ...prev, displayName: e.target.value }))}
                    className="w-full p-2 border rounded text-xs bg-white focus:outline-none"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">UTME Score</label>
                    <input
                      type="number"
                      min={0}
                      max={400}
                      value={tempProfile.jambScore}
                      onChange={(e) => setTempProfile(prev => ({ ...prev, jambScore: Number(e.target.value) }))}
                      className="w-full p-2 border rounded text-xs bg-white focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">School</label>
                    <select
                      value={tempProfile.targetInstitution}
                      onChange={(e) => setTempProfile(prev => ({ ...prev, targetInstitution: e.target.value }))}
                      className="w-full p-2 border rounded text-xs bg-white"
                    >
                      <option value="">Select</option>
                      <option value="UNILAG">UNILAG</option>
                      <option value="UI">UI</option>
                      <option value="OAU">OAU</option>
                      <option value="UNIBEN">UNIBEN</option>
                      <option value="ABU Zaria">ABU</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Intended Course</label>
                  <input
                    type="text"
                    value={tempProfile.intendedCourse}
                    onChange={(e) => setTempProfile(prev => ({ ...prev, intendedCourse: e.target.value }))}
                    className="w-full p-2 border rounded text-xs bg-white focus:outline-none"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowConfig(false)}
                    className="flex-1 py-1.5 border rounded text-xs hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-1.5 bg-[#032b44] text-white font-bold rounded text-xs hover:bg-[#054a73] transition"
                  >
                    Save Options
                  </button>
                </div>
              </form>
            )}

            {/* Glowing Sidebar Navigation Buttons */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-150 p-3 space-y-1">
              {[
                { key: 'dashboard', label: 'Student Hub', icon: <FaUser /> },
                { key: 'cbt', label: 'CBT Simulator', icon: <FaGraduationCap /> },
                { key: 'news', label: 'Verified News', icon: <FaBell /> },
                { key: 'syllabus', label: 'Syllabus Tracker', icon: <FaBookOpen /> },
                { key: 'forum', label: 'Peer Community', icon: <FaComment /> },
                { key: 'mentorship', label: 'Direct Mentorship', icon: <FaCalendarCheck /> },
                { key: 'calculator', label: 'Admission Calc', icon: <FaCalculator /> },
                { key: 'scholarships', label: 'Scholarship Alerts', icon: <FaFileAlt /> }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-bold text-sm transition text-left ${
                    activeTab === tab.key
                      ? 'bg-[#032b44] text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-[#032b44]'
                  }`}
                >
                  <span className="text-base">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

          </div>

          {/* 2. RIGHT MAIN VIEW WINDOW */}
          <div className="lg:col-span-9">
            
            {/* A. PORTAL STATS OVERVIEW HEADER (Mounted if tab is dashboard) */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                
                {/* Greeting banner */}
                <div className="bg-gradient-to-r from-[#032b44] to-[#f1a33b] rounded-2xl shadow-lg p-6 md:p-8 text-white">
                  <h1 className="text-3xl font-extrabold md:text-4xl">Welcome to Your Portal, {userProfile.displayName}!</h1>
                  <p className="text-white/80 text-sm mt-2 max-w-xl leading-relaxed">
                    Everything you need to secure your spot {userProfile.targetInstitution ? `at **${userProfile.targetInstitution}**` : ''} {userProfile.intendedCourse ? `for **${userProfile.intendedCourse}**` : ''} is right here. Practice CBT questions, track your JAMB syllabus, consult 1-on-1 mentors, and keep up with verified, rumor-free news bulletins!
                  </p>
                </div>

                {/* Dashboard Core Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  
                  {/* Stat Card 1 */}
                  <div className="bg-white rounded-2xl border border-gray-150 p-5 flex items-center gap-4 hover:shadow-sm transition">
                    <div className="bg-[#032b44]/10 p-3.5 rounded-xl text-[#032b44] text-xl shrink-0">
                      <FaTrophy />
                    </div>
                    <div>
                      <span className="block text-gray-400 font-bold uppercase text-[9px]">Simulator Attempts</span>
                      <span className="font-extrabold text-xl text-dark">0 Mock Exams</span>
                      <span className="block text-[10px] text-gray-500 font-semibold mt-0.5">Average Score: --%</span>
                    </div>
                  </div>

                  {/* Stat Card 2 */}
                  <div className="bg-white rounded-2xl border border-gray-150 p-5 flex items-center gap-4 hover:shadow-sm transition">
                    <div className="bg-teal-50 p-3.5 rounded-xl text-teal-700 text-xl shrink-0">
                      <FaBookOpen />
                    </div>
                    <div>
                      <span className="block text-gray-400 font-bold uppercase text-[9px]">Syllabus Progress</span>
                      <span className="font-extrabold text-xl text-dark">
                        {Object.values(userProfile.syllabusProgress || {}).filter(Boolean).length} Topics
                      </span>
                      <span className="block text-[10px] text-gray-500 font-semibold mt-0.5">Covered so far</span>
                    </div>
                  </div>

                  {/* Stat Card 3 */}
                  <div className="bg-white rounded-2xl border border-gray-150 p-5 flex items-center gap-4 hover:shadow-sm transition">
                    <div className="bg-amber-50 p-3.5 rounded-xl text-amber-700 text-xl shrink-0">
                      <FaBell />
                    </div>
                    <div>
                      <span className="block text-gray-400 font-bold uppercase text-[9px]">Target School</span>
                      <span className="font-extrabold text-xl text-dark">{userProfile.targetInstitution || 'None'}</span>
                      <span className="block text-[10px] text-gray-500 font-semibold mt-0.5">Update in profile config</span>
                    </div>
                  </div>

                </div>

                {/* Sub-portal feature quick launchers */}
                <div className="bg-white rounded-2xl border border-gray-150 p-6 md:p-8 space-y-6">
                  <h3 className="font-bold text-dark text-xl">Quick Portal Launchers</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Launcher 1 */}
                    <div 
                      onClick={() => setActiveTab('cbt')}
                      className="p-5 border border-gray-150 rounded-xl hover:border-[#032b44] cursor-pointer hover:shadow-sm transition flex items-start gap-4"
                    >
                      <div className="bg-[#032b44]/5 p-3 rounded-lg text-[#032b44] shrink-0"><FaGraduationCap className="text-xl" /></div>
                      <div>
                        <h4 className="font-bold text-dark text-sm">Post-UTME & JAMB CBT Engine</h4>
                        <p className="text-gray-500 text-xs mt-1.5 leading-relaxed">Mimic UNILAG/OAU exam rules. Review detailed AI performance metrics and battle peers in the Speed Arena.</p>
                      </div>
                    </div>

                    {/* Launcher 2 */}
                    <div 
                      onClick={() => setActiveTab('forum')}
                      className="p-5 border border-gray-150 rounded-xl hover:border-[#032b44] cursor-pointer hover:shadow-sm transition flex items-start gap-4"
                    >
                      <div className="bg-[#032b44]/5 p-3 rounded-lg text-[#032b44] shrink-0"><FaComment className="text-xl" /></div>
                      <div>
                        <h4 className="font-bold text-dark text-sm">Nairaland Peer Forum</h4>
                        <p className="text-gray-500 text-xs mt-1.5 leading-relaxed">Collaborate on hard questions, upvote threads, and receive solutions from active mentors in real-time.</p>
                      </div>
                    </div>

                    {/* Launcher 3 */}
                    <div 
                      onClick={() => setActiveTab('calculator')}
                      className="p-5 border border-gray-150 rounded-xl hover:border-[#032b44] cursor-pointer hover:shadow-sm transition flex items-start gap-4"
                    >
                      <div className="bg-[#032b44]/5 p-3 rounded-lg text-[#032b44] shrink-0"><FaCalculator className="text-xl" /></div>
                      <div>
                        <h4 className="font-bold text-dark text-sm">Admissions Aggregate Estimator</h4>
                        <p className="text-gray-500 text-xs mt-1.5 leading-relaxed">Combine your JAMB and WAEC results to calculate school-specific aggregates and estimate admission chances.</p>
                      </div>
                    </div>

                    {/* Launcher 4 */}
                    <div 
                      onClick={() => setActiveTab('news')}
                      className="p-5 border border-gray-150 rounded-xl hover:border-[#032b44] cursor-pointer hover:shadow-sm transition flex items-start gap-4"
                    >
                      <div className="bg-[#032b44]/5 p-3 rounded-lg text-[#032b44] shrink-0"><FaBell className="text-xl" /></div>
                      <div>
                        <h4 className="font-bold text-dark text-sm">Verified News Feed</h4>
                        <p className="text-gray-500 text-xs mt-1.5 leading-relaxed">Access official university cut-off lists and real-time updates direct from our ground on-campus representatives.</p>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            )}

            {/* B. DYNAMIC COMPONENT MOUNTING */}
            {activeTab === 'cbt' && <CbtEngine />}
            {activeTab === 'news' && <VerifiedNews />}
            {activeTab === 'syllabus' && <SyllabusTracker />}
            {activeTab === 'forum' && <CommunityForum />}
            {activeTab === 'mentorship' && <MentorshipBooking />}
            {activeTab === 'calculator' && <AdmissionCalculator />}
            {activeTab === 'scholarships' && <ScholarshipAlerts />}

          </div>

        </div>
      </div>
    </div>
  );
};

export default PortalDashboard;
