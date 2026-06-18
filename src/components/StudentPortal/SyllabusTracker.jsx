import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaRegCircle, FaBook, FaSearch } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { updateSyllabusProgress } from '../../firebaseServices';

// Hardcoded topics (These are standard across years, no need for DB)
const syllabusData = {
  Physics: [
    { id: 'p1', title: 'Measurements and Units' },
    { id: 'p2', title: 'Motion in One Dimension' },
    { id: 'p3', title: 'Work, Energy and Power' },
    { id: 'p4', title: 'Heat and Thermodynamics' }
  ],
  Chemistry: [
    { id: 'c1', title: 'Separation Techniques' },
    { id: 'c2', title: 'Atomic Structure' },
    { id: 'c3', title: 'Chemical Bonding' },
    { id: 'c4', title: 'Organic Chemistry I' }
  ],
  English: [
    { id: 'e1', title: 'Comprehension' },
    { id: 'e2', title: 'Lexis and Structure' },
    { id: 'e3', title: 'Oral English' }
  ]
};

const SyllabusTracker = () => {
  const { userProfile } = useAuth();
  const [activeSubject, setActiveSubject] = useState('Physics');
  const [search, setSearch] = useState('');
  
  // Progress is derived directly from userProfile
  const progressMap = userProfile?.syllabusProgress || {};

  const handleToggle = async (topicId) => {
    if (!userProfile) return;
    const isChecked = !progressMap[topicId];
    await updateSyllabusProgress(userProfile.uid, topicId, isChecked);
  };

  const currentTopics = syllabusData[activeSubject].filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase())
  );
  
  const totalInSubject = syllabusData[activeSubject].length;
  const completedInSubject = syllabusData[activeSubject].filter(t => progressMap[t.id]).length;
  const percentage = Math.round((completedInSubject / totalInSubject) * 100) || 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black text-[#032b44]">JAMB Syllabus Tracker</h2>
          <p className="text-gray-500 text-sm mt-1">Check off topics as you study to track your readiness.</p>
        </div>
        <div className="relative w-full md:w-64">
          <FaSearch className="absolute left-3 top-3.5 text-gray-400 text-sm" />
          <input 
            type="text" 
            placeholder="Search topics..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm focus:border-[#032b44] focus:outline-none"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-2">
        {Object.keys(syllabusData).map(sub => (
          <button
            key={sub}
            onClick={() => setActiveSubject(sub)}
            className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition ${
              activeSubject === sub 
                ? 'bg-[#032b44] text-white' 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      <div className="bg-gray-50 p-4 rounded-xl border border-gray-150 mb-6">
        <div className="flex justify-between text-sm font-bold mb-2">
          <span className="text-[#032b44]">{activeSubject} Progress</span>
          <span className="text-[#f1a33b]">{percentage}% ({completedInSubject}/{totalInSubject})</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-[#032b44] to-[#f1a33b] h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {currentTopics.map(topic => {
          const isDone = !!progressMap[topic.id];
          return (
            <div 
              key={topic.id}
              onClick={() => handleToggle(topic.id)}
              className={`p-4 border rounded-xl flex items-center gap-4 cursor-pointer transition ${
                isDone ? 'bg-green-50/50 border-green-200' : 'bg-white border-gray-150 hover:border-[#032b44]'
              }`}
            >
              <div className="shrink-0 text-xl">
                {isDone ? <FaCheckCircle className="text-green-500" /> : <FaRegCircle className="text-gray-300" />}
              </div>
              <div>
                <h4 className={`font-bold text-sm transition ${isDone ? 'text-green-800 line-through decoration-green-300' : 'text-dark'}`}>
                  {topic.title}
                </h4>
              </div>
            </div>
          )
        })}
        {currentTopics.length === 0 && (
          <div className="text-center py-6 text-gray-500 font-bold">No topics match your search.</div>
        )}
      </div>
    </div>
  );
};

export default SyllabusTracker;
