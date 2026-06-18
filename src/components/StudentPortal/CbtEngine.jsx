import React, { useState, useEffect } from 'react';
import { FaGraduationCap, FaClock, FaCheckCircle, FaExclamationTriangle, FaTrophy, FaBolt, FaUserCircle, FaWifi, FaHistory } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { saveCbtResult, getCbtResults } from '../../firebaseServices';

// Standard questions dataset covering different subjects and topics
const QUESTION_BANK = {
  English: [
    { id: 1, topic: 'Comprehension', question: 'In the passage, the phrase "precocious child" implies...', options: ['A child who is physically active', 'A child showing advanced mental development', 'A child who is extremely stubborn', 'A child struggling with studies'], answer: 1 },
    { id: 2, topic: 'Lexis & Structure', question: 'Choose the option nearest in meaning: The tutor gave a "lucid" explanation of the formula.', options: ['Vague', 'Complicated', 'Clear and easy to understand', 'Excited'], answer: 2 },
    { id: 3, topic: 'Concord', question: 'Neither the students nor their lecturer _______ present at the seminar yesterday.', options: ['were', 'was', 'are', 'is'], answer: 1 },
    { id: 4, topic: 'Antonyms', question: 'Choose the option opposite in meaning to: The politician was known for his "frugal" lifestyle.', options: ['Stingy', 'Extravagant', 'Humble', 'Dishonest'], answer: 1 }
  ],
  Mathematics: [
    { id: 1, topic: 'Calculus', question: 'Find the derivative of y = 3x^2 + 5x - 2 with respect to x.', options: ['6x', '6x + 5', '3x + 5', '6x^2 + 5'], answer: 1 },
    { id: 2, topic: 'Algebra', question: 'Solve for x: log10(x - 3) = 2', options: ['103', '97', '13', '23'], answer: 0 },
    { id: 3, topic: 'Trigonometry', question: 'If sin(θ) = 4/5 and θ is acute, find the value of tan(θ).', options: ['3/5', '3/4', '4/3', '5/4'], answer: 2 },
    { id: 4, topic: 'Geometry', question: 'What is the sum of the interior angles of a regular hexagon?', options: ['360°', '540°', '720°', '900°'], answer: 2 }
  ],
  Chemistry: [
    { id: 1, topic: 'Organic Chemistry', question: 'Which of the following compounds is an isomer of Butane?', options: ['Methylpropane', 'Methylbutane', '2-Methylpropane', 'Propene'], answer: 2 },
    { id: 2, topic: 'Stoichiometry', question: 'Calculate the number of moles in 20g of Calcium Carbonate (CaCO3). [Ca=40, C=12, O=16]', options: ['0.1 moles', '0.2 moles', '0.5 moles', '1.0 moles'], answer: 1 },
    { id: 3, topic: 'Electrochemistry', question: 'During the electrolysis of acidified water, what gas is liberated at the anode?', options: ['Hydrogen', 'Oxygen', 'Chlorine', 'Nitrogen'], answer: 1 },
    { id: 4, topic: 'Gas Laws', question: 'If a gas occupies a volume of 2L at 1 atm, what is its volume at 4 atm if temperature is constant?', options: ['8L', '4L', '1L', '0.5L'], answer: 3 }
  ],
  Physics: [
    { id: 1, topic: 'Mechanics', question: 'A car accelerates uniformly from rest at 4 m/s^2 for 5 seconds. Calculate the distance covered.', options: ['20m', '50m', '100m', '10m'], answer: 1 },
    { id: 2, topic: 'Wave Optics', question: 'The splitting of white light into its component colors through a glass prism is called ______', options: ['Reflection', 'Refraction', 'Diffraction', 'Dispersion'], answer: 3 },
    { id: 3, topic: 'Electricity', question: 'Three resistors of 2Ω, 3Ω, and 6Ω are connected in parallel. Calculate the equivalent resistance.', options: ['11Ω', '1Ω', '3Ω', '0.5Ω'], answer: 1 },
    { id: 4, topic: 'Modern Physics', question: 'The emission of electrons when light shines on a metal surface is known as ______', options: ['Thermionic emission', 'Compton effect', 'Photoelectric effect', 'X-ray production'], answer: 2 }
  ],
  Biology: [
    { id: 1, topic: 'Genetics', question: 'A cross between a homozygous tall plant (TT) and a dwarf plant (tt) will produce offspring that are:', options: ['All dwarf', 'All tall', '50% tall, 50% dwarf', '75% tall, 25% dwarf'], answer: 1 },
    { id: 2, topic: 'Cell Biology', question: 'Which organelle is referred to as the powerhouse of the cell?', options: ['Nucleus', 'Ribosome', 'Mitochondrion', 'Golgi body'], answer: 2 },
    { id: 3, topic: 'Ecology', question: 'The association between nitrogen-fixing bacteria in root nodules of legumes is an example of:', options: ['Parasitism', 'Commensalism', 'Mutualism', 'Saprophytism'], answer: 2 },
    { id: 4, topic: 'Human Physiology', question: 'Which part of the brain is responsible for maintaining body balance and coordination?', options: ['Cerebrum', 'Cerebellum', 'Medulla Oblongata', 'Hypothalamus'], answer: 1 }
  ]
};

const SCHOOLS = [
  { name: 'University of Lagos (UNILAG)', key: 'UNILAG', duration: 30, questionsCount: 15, subjects: ['English', 'Mathematics', 'General Paper'] },
  { name: 'University of Ibadan (UI)', key: 'UI', duration: 75, questionsCount: 20, subjects: ['English', 'Biology', 'Chemistry', 'Physics'] },
  { name: 'Obafemi Awolowo University (OAU)', key: 'OAU', duration: 60, questionsCount: 20, subjects: ['English', 'Mathematics', 'Physics', 'Chemistry'] },
  { name: 'University of Benin (UNIBEN)', key: 'UNIBEN', duration: 60, questionsCount: 20, subjects: ['English', 'Biology', 'Chemistry', 'Physics'] },
  { name: 'Ahmadu Bello University (ABU)', key: 'ABU', duration: 60, questionsCount: 20, subjects: ['English', 'Mathematics', 'Physics', 'Chemistry'] },
  { name: 'General JAMB Practice', key: 'JAMB', duration: 120, questionsCount: 20, subjects: ['English', 'Mathematics', 'Physics', 'Chemistry'] }
];

const CbtEngine = () => {
  const { currentUser, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('setup'); // 'setup', 'exam', 'result', 'challenge', 'history'
  const [selectedSchool, setSelectedSchool] = useState(SCHOOLS[0]);
  const [selectedSubjects, setSelectedSubjects] = useState(['English', 'Mathematics', 'Chemistry']);
  const [isOffline, setIsOffline] = useState(false);
  const [examQuestions, setExamQuestions] = useState([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // questionIdx: selectedOptionIdx
  const [timeLeft, setTimeLeft] = useState(0);
  const [examResult, setExamResult] = useState(null);
  const [history, setHistory] = useState([]);

  // Gamified Challenge state
  const [opponentProgress, setOpponentProgress] = useState(0);
  const [myChallengeScore, setMyChallengeScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [challengeResult, setChallengeResult] = useState('');
  const [opponentName, setOpponentName] = useState('Amina');

  useEffect(() => {
    const fetchHistory = async () => {
      if (currentUser) {
        const h = await getCbtResults(currentUser.uid);
        setHistory(h);
      }
    };
    fetchHistory();
  }, [currentUser, activeTab]);

  // Timer Effect
  useEffect(() => {
    if (activeTab !== 'exam' || timeLeft <= 0) {
      if (activeTab === 'exam' && timeLeft === 0) {
        handleSubmitExam();
      }
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [activeTab, timeLeft]);

  const handleStartExam = () => {
    const compile = [];
    selectedSubjects.forEach(subj => {
      if (QUESTION_BANK[subj]) {
        QUESTION_BANK[subj].forEach(q => {
          compile.push({ ...q, subject: subj });
        });
      }
    });
    setExamQuestions(compile.slice(0, selectedSchool.questionsCount));
    setUserAnswers({});
    setCurrentQuestionIdx(0);
    setTimeLeft(selectedSchool.duration * 60);
    setActiveTab('exam');
  };

  const handleOptionSelect = (optionIdx) => {
    setUserAnswers(prev => ({ ...prev, [currentQuestionIdx]: optionIdx }));
  };

  const handleSubmitExam = async () => {
    let score = 0;
    const breakdown = {};
    const wrongTopics = [];
    const strongTopics = [];

    examQuestions.forEach((q, idx) => {
      const isCorrect = userAnswers[idx] === q.answer;
      if (isCorrect) {
        score++;
        if (!strongTopics.includes(q.topic)) strongTopics.push(q.topic);
      } else {
        if (!wrongTopics.includes(q.topic)) wrongTopics.push(q.topic);
      }

      if (!breakdown[q.subject]) {
        breakdown[q.subject] = { total: 0, correct: 0 };
      }
      breakdown[q.subject].total++;
      if (isCorrect) breakdown[q.subject].correct++;
    });

    const aiTips = [];
    if (wrongTopics.length > 0) {
      aiTips.push(`You are struggling with key topics: **${wrongTopics.join(', ')}**.`);
      wrongTopics.forEach(t => {
        if (t === 'Organic Chemistry') aiTips.push('💡 Organic Chemistry Tip: Revise isomerism rules and functional group IUPAC naming.');
        if (t === 'Calculus') aiTips.push('💡 Calculus Tip: Focus on derivative rules (product and quotient rules).');
        if (t === 'Stoichiometry') aiTips.push('💡 Stoichiometry Tip: Remember standard formula Moles = Mass / Molar Mass.');
        if (t === 'Mechanics') aiTips.push('💡 Mechanics Tip: Review equations of linear motion (v = u + at, s = ut + 0.5at²).');
        if (t === 'Concord') aiTips.push('💡 Concord Tip: Singular subjects take singular verbs, plural subjects take plural verbs.');
      });
    } else {
      aiTips.push('🔥 Outstanding! You answered everything correctly across all tested topics. Maintain this discipline!');
    }

    const resultPayload = {
      score,
      total: examQuestions.length,
      breakdown,
      aiTips,
      strongTopics,
      wrongTopics,
      school: selectedSchool.name
    };

    if (currentUser && !isOffline) {
      await saveCbtResult(currentUser.uid, resultPayload);
    }

    setExamResult(resultPayload);
    setActiveTab('result');
  };

  const handleStartChallenge = () => {
    setActiveTab('challenge');
    setMyChallengeScore(0);
    setOpponentScore(0);
    setOpponentProgress(0);
    setChallengeResult('Fighting');
    
    const opponents = ['Amina (UNILAG)', 'Chinedu (UI)', 'Sani (ABU)', 'Tolani (OAU)'];
    setOpponentName(opponents[Math.floor(Math.random() * opponents.length)]);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setOpponentProgress(progress);
      
      if (Math.random() > 0.45) {
        setOpponentScore(prev => prev + 1);
      }

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setChallengeResult('Completed');
        }, 1000);
      }
    }, 1500);
  };

  const handleChallengeAnswer = (isCorrect) => {
    if (isCorrect) {
      setMyChallengeScore(prev => prev + 1);
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6 flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-dark flex items-center gap-2">
            <FaGraduationCap className="text-[#032b44] text-3xl" /> CBT Exam Simulator
          </h2>
          <p className="text-gray-500 text-sm">Advanced school-specific testing portal</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setActiveTab('setup')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
              activeTab === 'setup' || activeTab === 'exam' || activeTab === 'result' ? 'bg-[#032b44] text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Exam Center
          </button>
          <button 
            onClick={() => handleStartChallenge()}
            className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition ${
              activeTab === 'challenge' ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
            }`}
          >
            <FaBolt /> Live Challenge Arena
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition ${
              activeTab === 'history' ? 'bg-teal-600 text-white' : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
            }`}
          >
            <FaHistory /> History
          </button>
        </div>
      </div>

      {/* 1. SETUP SCREEN */}
      {activeTab === 'setup' && (
        <div className="space-y-6">
          <div className="bg-[#032b44]/5 border border-[#032b44]/10 rounded-xl p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FaWifi className="text-[#032b44] text-xl" />
              <div>
                <h4 className="font-semibold text-dark text-sm">Offline Testing Engine</h4>
                <p className="text-xs text-gray-500">Enable local mode to save data. Results won't sync to the cloud in offline mode.</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={isOffline} 
                onChange={(e) => setIsOffline(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-[#032b44] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#032b44]"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold text-sm mb-2">Select Target Institution</label>
              <select 
                value={selectedSchool.key}
                onChange={(e) => setSelectedSchool(SCHOOLS.find(s => s.key === e.target.value))}
                className="w-full p-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-[#032b44]"
              >
                {SCHOOLS.map(school => (
                  <option key={school.key} value={school.key}>{school.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold text-sm mb-2">Subject Selection</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(QUESTION_BANK).map(subj => {
                  const isChecked = selectedSubjects.includes(subj);
                  return (
                    <button
                      key={subj}
                      onClick={() => {
                        if (isChecked) {
                          if (selectedSubjects.length > 1) setSelectedSubjects(prev => prev.filter(s => s !== subj));
                        } else {
                          setSelectedSubjects(prev => [...prev, subj]);
                        }
                      }}
                      className={`p-2.5 rounded-lg border text-left text-sm font-semibold transition ${
                        isChecked ? 'bg-[#032b44] text-white border-[#032b44]' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {subj} {isChecked && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <button
            onClick={handleStartExam}
            className="w-full bg-[#032b44] text-white font-bold py-4 rounded-xl shadow-lg hover:bg-[#054a73] duration-300 transition"
          >
            Launch School Simulation Now
          </button>
        </div>
      )}

      {/* 2. EXAM ACTIVE SCREEN */}
      {activeTab === 'exam' && examQuestions.length > 0 && (
        <div className="animate-fadeIn">
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
            <div>
              <span className="text-xs text-gray-500 font-bold tracking-wider">{selectedSchool.name}</span>
              <h3 className="font-bold text-dark text-lg">Question {currentQuestionIdx + 1} of {examQuestions.length}</h3>
            </div>
            <div className="flex items-center gap-2 bg-[#032b44] text-white px-4 py-2 rounded-lg font-bold">
              <FaClock /> {formatTime(timeLeft)}
            </div>
          </div>

          <div className="min-h-[160px] bg-gray-50/50 rounded-xl p-6 border border-gray-150 mb-6">
            <span className="inline-block bg-[#032b44]/10 text-[#032b44] text-xs font-bold px-3 py-1 rounded-full mb-3">
              {examQuestions[currentQuestionIdx].subject} - {examQuestions[currentQuestionIdx].topic}
            </span>
            <p className="text-dark text-lg font-semibold leading-relaxed">
              {examQuestions[currentQuestionIdx].question}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {examQuestions[currentQuestionIdx].options.map((option, idx) => {
              const isSelected = userAnswers[currentQuestionIdx] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  className={`p-4 rounded-xl border-2 text-left font-medium transition ${
                    isSelected 
                      ? 'border-[#032b44] bg-[#032b44]/5 text-[#032b44]' 
                      : 'border-gray-200 hover:border-[#032b44] bg-white text-gray-700'
                  }`}
                >
                  <span className="inline-block bg-gray-100 text-gray-600 font-bold w-7 h-7 rounded-full text-center leading-7 mr-3">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {option}
                </button>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <button
              onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIdx === 0}
              className="px-6 py-3 rounded-lg border border-gray-200 font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous Question
            </button>

            <div className="hidden lg:flex gap-1.5 overflow-x-auto max-w-[40%] py-2">
              {examQuestions.map((_, idx) => (
                <div 
                  key={idx}
                  onClick={() => setCurrentQuestionIdx(idx)}
                  className={`w-3.5 h-3.5 rounded-full cursor-pointer transition ${
                    currentQuestionIdx === idx 
                      ? 'bg-[#f1a33b] scale-125' 
                      : userAnswers[idx] !== undefined 
                        ? 'bg-[#032b44]' 
                        : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>

            {currentQuestionIdx < examQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                className="px-6 py-3 bg-[#032b44] text-white font-semibold rounded-lg hover:bg-[#054a73] transition"
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={handleSubmitExam}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-md transition"
              >
                Submit Exam Script
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. EXAM RESULTS SCREEN */}
      {activeTab === 'result' && examResult && (
        <div className="space-y-6 animate-fadeIn">
          <div className="text-center p-6 bg-gray-50 rounded-2xl border border-gray-150">
            <FaTrophy className="text-[#f1a33b] text-5xl mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-dark">Simulation Completed!</h3>
            <p className="text-gray-500 mt-1">Here is a deep performance breakdown of your exam script.</p>
            <div className="text-4xl font-extrabold text-[#032b44] mt-4">
              {examResult.score} / {examResult.total}
              <span className="text-lg text-gray-500 font-medium ml-2">
                ({Math.round((examResult.score / examResult.total) * 100)}%)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <h4 className="font-bold text-dark mb-3 flex items-center gap-2">
                <FaCheckCircle className="text-green-500" /> Subject Specific Performance
              </h4>
              <div className="space-y-4">
                {Object.keys(examResult.breakdown).map(subj => {
                  const data = examResult.breakdown[subj];
                  const percent = Math.round((data.correct / data.total) * 100);
                  return (
                    <div key={subj}>
                      <div className="flex justify-between text-sm font-semibold text-gray-600 mb-1">
                        <span>{subj}</span>
                        <span>{data.correct} / {data.total} ({percent}%)</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${percent >= 70 ? 'bg-green-500' : percent >= 45 ? 'bg-amber-400' : 'bg-red-500'}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-[#032b44]/5 border border-[#032b44]/10 rounded-xl p-5">
              <h4 className="font-bold text-[#032b44] mb-3 flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#032b44] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#032b44]"></span>
                </span>
                Smart AI Analysis Insights
              </h4>
              <div className="space-y-3.5">
                {examResult.aiTips.map((tip, idx) => (
                  <p 
                    key={idx} 
                    className="text-sm text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: tip.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('setup')}
              className="flex-1 bg-[#032b44] text-white font-bold py-3.5 rounded-xl text-center hover:bg-[#054a73] transition"
            >
              Take Another Simulation
            </button>
          </div>
        </div>
      )}

      {/* 4. HISTORY SCREEN */}
      {activeTab === 'history' && (
        <div className="space-y-4 animate-fadeIn">
          {history.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500 font-bold">No exam history found. Take a simulation first!</p>
            </div>
          ) : (
            history.map(item => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center hover:shadow-sm transition">
                <div>
                  <h4 className="font-bold text-dark">{item.school} Mock Exam</h4>
                  <p className="text-xs text-gray-500 mt-1">{item.createdAt?.toDate().toLocaleString() || 'Recent'}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-[#032b44]">{item.score} / {item.total}</div>
                  <div className="text-xs font-bold text-[#f1a33b]">{Math.round((item.score/item.total)*100)}%</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 5. GAMIFIED CHALLENGE MODE SCREEN */}
      {activeTab === 'challenge' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6 text-center">
            <span className="inline-block bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full mb-2">
              BATTLE ARENA ACTIVE
            </span>
            <h3 className="text-2xl font-bold text-[#032b44] flex justify-center items-center gap-2">
              <FaBolt className="text-amber-500 animate-bounce" /> Real-time H2H Quiz Battle
            </h3>
            <p className="text-gray-600 text-sm mt-1">Answer correctly as fast as you can. Winning awards +100 XP!</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-150 space-y-5">
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <FaUserCircle className="text-[#032b44] text-xl" />
                  <span className="font-bold text-sm text-dark">You ({userProfile?.displayName})</span>
                </div>
                <span className="font-extrabold text-[#032b44]">{myChallengeScore} Pts</span>
              </div>
              <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden border border-gray-200">
                <div 
                  className="bg-gradient-to-r from-teal-400 to-[#032b44] h-full rounded-full transition-all duration-300"
                  style={{ width: `${(myChallengeScore / 10) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <FaUserCircle className="text-red-500 text-xl" />
                  <span className="font-bold text-sm text-dark">{opponentName}</span>
                </div>
                <span className="font-extrabold text-red-500">{opponentScore} Pts</span>
              </div>
              <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden border border-gray-200">
                <div 
                  className="bg-gradient-to-r from-red-400 to-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${opponentProgress}%` }}
                />
              </div>
            </div>
          </div>

          {challengeResult === 'Fighting' ? (
            <div className="bg-gray-50 rounded-xl p-5 border text-center border-gray-200">
              <h4 className="font-semibold text-gray-700 text-sm mb-3">QUESTION DUMP</h4>
              <p className="text-dark text-lg font-bold leading-relaxed mb-4">
                "Solve for y if 3y - 5 = 2y + 7."
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => handleChallengeAnswer(false)} className="p-3 bg-white border rounded-lg font-bold hover:bg-gray-50 transition">y = 2</button>
                <button onClick={() => handleChallengeAnswer(true)} className="p-3 bg-white border rounded-lg font-bold hover:bg-gray-50 transition">y = 12</button>
                <button onClick={() => handleChallengeAnswer(false)} className="p-3 bg-white border rounded-lg font-bold hover:bg-gray-50 transition">y = -2</button>
                <button onClick={() => handleChallengeAnswer(false)} className="p-3 bg-white border rounded-lg font-bold hover:bg-gray-50 transition">y = 5</button>
              </div>
            </div>
          ) : (
            <div className="text-center p-6 bg-gray-50 border rounded-2xl border-gray-150 animate-fadeIn">
              <FaTrophy className="text-[#f1a33b] text-5xl mx-auto mb-3" />
              <h4 className="text-2xl font-bold text-dark">
                {myChallengeScore > opponentScore ? '🎉 You Won the Battle!' : myChallengeScore === opponentScore ? '🤝 It is a Tie!' : '😢 Opponent Won!'}
              </h4>
              <p className="text-gray-500 text-sm mt-1">Final Score: {myChallengeScore} vs {opponentScore}</p>
              <div className="mt-4 flex gap-2 justify-center">
                <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
                  +{myChallengeScore > opponentScore ? '100 XP' : '20 XP'} Earned
                </span>
                {myChallengeScore > opponentScore && (
                  <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">
                    1 Raffle Ticket Obtained
                  </span>
                )}
              </div>
              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => handleStartChallenge()}
                  className="flex-1 bg-[#f1a33b] text-white font-bold py-3 rounded-lg hover:opacity-90 transition"
                >
                  Battle Again!
                </button>
                <button
                  onClick={() => setActiveTab('setup')}
                  className="flex-1 bg-[#032b44] text-white font-bold py-3 rounded-lg hover:bg-[#054a73] transition"
                >
                  Back to Simulator
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CbtEngine;
