import React, { useState, useEffect } from 'react';
import { 
  FaLock, FaCheckCircle, FaTrash, FaPlusCircle, FaNewspaper, 
  FaCalendarCheck, FaCommentSlash, FaFileAlt, FaDatabase 
} from 'react-icons/fa';
import { 
  getAdminStats, publishNews, getForumPosts, deleteForumPost, 
  getAllBookings, publishScholarship 
} from '../../firebaseServices';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  
  const [activeAdminTab, setActiveAdminTab] = useState('stats');
  
  // Dynamic Stats
  const [stats, setStats] = useState({ news: 0, bookings: 0, forums: 0, scholarships: 0, tutors: 0 });

  // News Creation Form States
  const [newsTitle, setNewsTitle] = useState('');
  const [newsExcerpt, setNewsExcerpt] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsCategory, setNewsCategory] = useState('UNILAG');
  const [newsIsVerified, setNewsIsVerified] = useState(true);
  const [newsIsRep, setNewsIsRep] = useState(false);
  const [newsRepName, setNewsRepName] = useState('');
  const [newsRepUniversity, setNewsRepUniversity] = useState('UNILAG');
  const [newsTargetCourses, setNewsTargetCourses] = useState('');
  const [newsStatus, setNewsStatus] = useState('');

  // Forum threads moderation states
  const [forumPosts, setForumPosts] = useState([]);
  const [bookingsList, setBookingsList] = useState([]);

  // Scholarship Creation States
  const [schTitle, setSchTitle] = useState('');
  const [schProvider, setSchProvider] = useState('');
  const [schWorth, setSchWorth] = useState('');
  const [schDeadline, setSchDeadline] = useState('');
  const [schMinJamb, setSchMinJamb] = useState(250);
  const [schCourses, setSchCourses] = useState('Computer Science, Medicine, Engineering');
  const [schStatus, setSchStatus] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      loadStatsAndModeration();
    }
  }, [isAuthenticated]);

  const loadStatsAndModeration = async () => {
    try {
      const dbStats = await getAdminStats();
      setStats(dbStats);

      const posts = await getForumPosts();
      setForumPosts(posts);

      const bookings = await getAllBookings();
      setBookingsList(bookings);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    }
  };

  const handleAuthenticate = (e) => {
    e.preventDefault();
    if (passcode === '1234') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Access Denied. Invalid Admin Security Passcode.');
    }
  };

  const handlePublishNews = async (e) => {
    e.preventDefault();
    if (!newsTitle.trim() || !newsContent.trim()) return;

    const newPost = {
      title: newsTitle,
      excerpt: newsExcerpt || newsContent.substr(0, 120) + '...',
      content: newsContent,
      category: newsCategory,
      isVerified: newsIsVerified,
      isCampusRep: newsIsRep,
      repName: newsIsRep ? newsRepName : null,
      repUniversity: newsIsRep ? newsRepUniversity : null,
      targetCourses: newsTargetCourses ? newsTargetCourses.split(',').map(c => c.trim()) : []
    };

    try {
      await publishNews(newPost);
      setNewsStatus('Article successfully published to Cloud Firestore!');
    } catch (err) {
      console.error('Publishing failed:', err);
      setNewsStatus('Failed to publish article.');
      return;
    }

    // Reset Form
    setNewsTitle('');
    setNewsExcerpt('');
    setNewsContent('');
    setNewsTargetCourses('');
    loadStatsAndModeration();
    setTimeout(() => setNewsStatus(''), 3000);
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this thread?")) return;
    try {
      await deleteForumPost(postId);
      setForumPosts(prev => prev.filter(p => p.id !== postId));
      setStats(prev => ({ ...prev, forums: prev.forums - 1 }));
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  };

  const handlePublishScholarship = async (e) => {
    e.preventDefault();
    if (!schTitle.trim() || !schWorth.trim()) return;

    const newSch = {
      title: schTitle,
      provider: schProvider,
      amount: parseInt(schWorth.replace(/\D/g,'')) || 100000,
      worth: schWorth, // display string
      deadline: schDeadline,
      minJamb: Number(schMinJamb),
      eligibleCourses: schCourses.split(',').map(c => c.trim()),
      description: 'Newly published freshman scholarship opportunity.'
    };

    setSchStatus('Saving scholarship details...');
    
    try {
      await publishScholarship(newSch);
      setSchTitle('');
      setSchProvider('');
      setSchWorth('');
      setSchDeadline('');
      setSchStatus('Scholarship Published Successfully!');
      loadStatsAndModeration();
    } catch (err) {
      console.error("Failed to publish scholarship:", err);
      setSchStatus('Failed to publish scholarship.');
    }
    setTimeout(() => setSchStatus(''), 3000);
  };

  // Ensure user is allowed (example extra guard, even though protected route)
  if (currentUser?.email !== "admin@pinnacle.com") {
    return (
      <div className="bg-[#032b44] min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl text-center">
          <FaLock className="text-[#032b44] text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-black text-red-600">Unauthorized Access</h2>
          <p className="text-gray-500 text-sm mt-2">Only admin@pinnacle.com can access this portal.</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-[#032b44] min-h-screen flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-md border border-white/20 rounded-2xl max-w-md w-full p-8 shadow-2xl space-y-6 text-center animate-fadeIn">
          <div className="bg-[#032b44] text-white w-14 h-14 rounded-full flex items-center justify-center mx-auto shadow-inner text-xl">
            <FaLock />
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#032b44]">Admin Portal Guard</h2>
            <p className="text-gray-500 text-xs mt-1">Authorized Pinnacle Academia Staff Only</p>
          </div>

          <form onSubmit={handleAuthenticate} className="space-y-4">
            <div>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter Admin PIN Code"
                className="w-full text-center p-3 border-2 border-gray-200 rounded-xl font-bold tracking-widest text-lg focus:outline-none focus:border-[#032b44]"
                required
              />
            </div>

            {authError && (
              <p className="text-red-600 text-xs font-bold bg-red-50 p-2.5 rounded-lg border border-red-200">
                ⚠️ {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-[#032b44] hover:bg-[#054a73] text-white font-bold py-3.5 rounded-xl shadow-lg transition"
            >
              Verify & Unlock Console
            </button>
          </form>
          <div className="text-[10px] text-gray-400">Default Sandbox Code: 1234</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 pb-4 mb-6 gap-4">
          <div>
            <span className="text-xs font-bold text-[#f1a33b] uppercase tracking-wider">Pinnacle Console</span>
            <h1 className="text-3xl font-extrabold text-[#032b44] flex items-center gap-2">
              <FaDatabase /> Operations Command Center
            </h1>
          </div>

          <div className="flex bg-gray-200 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
            {[
              { key: 'stats', label: 'Stats Hub' },
              { key: 'news', label: 'News Publisher' },
              { key: 'forum', label: 'Forum Moderation' },
              { key: 'bookings', label: 'Mentorship Bookings' },
              { key: 'scholarships', label: 'Add Scholarships' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveAdminTab(tab.key)}
                className={`px-4 py-2 rounded-lg font-bold text-xs transition whitespace-nowrap ${
                  activeAdminTab === tab.key ? 'bg-[#032b44] text-white' : 'text-gray-600 hover:text-dark'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 1. STATS HUB */}
        {activeAdminTab === 'stats' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-[#032b44] rounded-2xl shadow-lg p-6 md:p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl" />
              <h2 className="text-2xl font-black relative z-10">System Operations Dashboard</h2>
              <p className="text-white/80 text-xs mt-1.5 leading-relaxed max-w-lg relative z-10">
                Fully monitor, publish, and moderate student activities across the platform. Real-time Firebase integrations sync updates instantly to candidate portals.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border p-5 rounded-2xl shadow-sm text-center">
                <span className="block text-gray-400 font-bold text-[9px] uppercase">News Updates</span>
                <span className="font-extrabold text-3xl text-dark block mt-1">{stats.news}</span>
                <span className="text-[10px] text-green-600 font-bold mt-1 inline-block">Active Feed</span>
              </div>
              <div className="bg-white border p-5 rounded-2xl shadow-sm text-center">
                <span className="block text-gray-400 font-bold text-[9px] uppercase">Forum Threads</span>
                <span className="font-extrabold text-3xl text-dark block mt-1">{stats.forums}</span>
                <span className="text-[10px] text-[#032b44] font-bold mt-1 inline-block">Student Discussions</span>
              </div>
              <div className="bg-white border p-5 rounded-2xl shadow-sm text-center">
                <span className="block text-gray-400 font-bold text-[9px] uppercase">Consultation Booked</span>
                <span className="font-extrabold text-3xl text-dark block mt-1">{stats.bookings}</span>
                <span className="text-[10px] text-green-600 font-bold mt-1 inline-block">Scheduled Sessions</span>
              </div>
              <div className="bg-white border p-5 rounded-2xl shadow-sm text-center">
                <span className="block text-gray-400 font-bold text-[9px] uppercase">Bursaries Listed</span>
                <span className="font-extrabold text-3xl text-dark block mt-1">{stats.scholarships}</span>
                <span className="text-[10px] text-amber-600 font-bold mt-1 inline-block">High-Traffic alerts</span>
              </div>
            </div>
          </div>
        )}

        {/* 2. NEWS PUBLISHER */}
        {activeAdminTab === 'news' && (
          <div className="bg-white border rounded-2xl p-6 md:p-8 space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-bold text-dark flex items-center gap-2">
                <FaNewspaper className="text-teal-600" /> Publish Verified News Bulletin
              </h2>
              <p className="text-gray-500 text-xs mt-1">Updates are instantly ranked on students' personalized feeds based on target schools.</p>
            </div>

            <form onSubmit={handlePublishNews} className="space-y-4">
              {newsStatus && (
                <div className={`p-3 text-xs font-bold rounded-lg border ${newsStatus.includes('Failed') ? 'bg-red-50 text-red-800 border-red-200' : 'bg-green-50 text-green-800 border-green-200'}`}>
                  {newsStatus.includes('Failed') ? '⚠️' : '✓'} {newsStatus}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Article Title</label>
                  <input
                    type="text"
                    value={newsTitle}
                    onChange={(e) => setNewsTitle(e.target.value)}
                    placeholder="e.g. UNILAG merit list released on CAPS"
                    className="w-full p-2.5 border rounded-lg bg-white text-sm"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Category</label>
                    <select
                      value={newsCategory}
                      onChange={(e) => setNewsCategory(e.target.value)}
                      className="w-full p-2.5 border rounded-lg bg-white text-sm"
                    >
                      <option value="UNILAG">UNILAG</option>
                      <option value="UI">UI</option>
                      <option value="OAU">OAU</option>
                      <option value="UNIBEN">UNIBEN</option>
                      <option value="ABU Zaria">ABU Zaria</option>
                      <option value="JAMB">General JAMB</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Target Courses</label>
                    <input
                      type="text"
                      value={newsTargetCourses}
                      onChange={(e) => setNewsTargetCourses(e.target.value)}
                      placeholder="Medicine, Law (comma separated)"
                      className="w-full p-2.5 border rounded-lg bg-white text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 border rounded-xl">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newsIsVerified}
                    onChange={(e) => setNewsIsVerified(e.target.checked)}
                    id="verifiedCheck"
                  />
                  <label htmlFor="verifiedCheck" className="text-xs font-bold text-gray-700">Flag as VERIFIED</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newsIsRep}
                    onChange={(e) => setNewsIsRep(e.target.checked)}
                    id="repCheck"
                  />
                  <label htmlFor="repCheck" className="text-xs font-bold text-gray-700">Campus Rep circular</label>
                </div>
                {newsIsRep && (
                  <>
                    <input
                      type="text"
                      value={newsRepName}
                      onChange={(e) => setNewsRepName(e.target.value)}
                      placeholder="Rep Name"
                      className="p-1.5 border rounded text-xs bg-white"
                      required
                    />
                    <select
                      value={newsRepUniversity}
                      onChange={(e) => setNewsRepUniversity(e.target.value)}
                      className="p-1.5 border rounded text-xs bg-white"
                    >
                      <option value="UNILAG">UNILAG</option>
                      <option value="UI">UI</option>
                      <option value="OAU">OAU</option>
                      <option value="UNIBEN">UNIBEN</option>
                    </select>
                  </>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Article Content</label>
                <textarea
                  value={newsContent}
                  onChange={(e) => setNewsContent(e.target.value)}
                  placeholder="Provide precise admission circular information..."
                  rows={6}
                  className="w-full p-2.5 border rounded-lg bg-white text-sm resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#032b44] hover:bg-[#054a73] text-white font-bold py-3 rounded-xl transition"
              >
                Publish news article
              </button>
            </form>
          </div>
        )}

        {/* 3. FORUM MODERATION */}
        {activeAdminTab === 'forum' && (
          <div className="bg-white border rounded-2xl p-6 md:p-8 space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-bold text-dark flex items-center gap-2">
                <FaCommentSlash className="text-red-500" /> Forum Thread Moderation
              </h2>
              <p className="text-gray-500 text-xs mt-1">Review active Nairaland threads. Delete offensive or spam threads instantly.</p>
            </div>

            {forumPosts.length === 0 ? (
               <p className="text-gray-500 text-sm italic py-4">No active forum posts.</p>
            ) : (
              <div className="space-y-3.5">
                {forumPosts.map(post => (
                  <div key={post.id} className="p-4 border rounded-xl flex items-center justify-between gap-4 bg-gray-50 hover:bg-white hover:border-[#032b44] transition">
                    <div>
                      <div className="flex items-center gap-2 text-[10px] text-gray-400">
                        <span className="font-extrabold uppercase bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                          {post.category}
                        </span>
                        <span>By {post.authorName}</span>
                      </div>
                      <h4 className="font-bold text-dark text-sm mt-1">{post.title}</h4>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{post.content}</p>
                    </div>

                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="p-2.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      <FaTrash /> Delete Thread
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. BOOKINGS AUDITOR */}
        {activeAdminTab === 'bookings' && (
          <div className="bg-white border rounded-2xl p-6 md:p-8 space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-bold text-dark flex items-center gap-2">
                <FaCalendarCheck className="text-green-600" /> Mentorship Appointments Audit
              </h2>
              <p className="text-gray-500 text-xs mt-1">Active ledger of freshman consultations scheduled with department mentors.</p>
            </div>

            {bookingsList.length === 0 ? (
              <p className="text-gray-500 text-sm italic py-4">No bookings registered in cloud database ledger yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookingsList.map(book => (
                  <div key={book.id} className="p-4 border border-green-200 rounded-xl bg-green-50 shadow-sm">
                    <span className="inline-block bg-green-200 text-green-900 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      STATUS: {book.status}
                    </span>
                    <h4 className="font-bold text-dark mt-2">Call with {book.tutorName}</h4>
                    <div className="text-xs text-gray-600 space-y-1 mt-2 font-medium">
                      <div>Student: **{book.studentName}**</div>
                      <div className="text-[#032b44]">Date & Time: {book.date} • {book.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 5. ADD SCHOLARSHIPS */}
        {activeAdminTab === 'scholarships' && (
          <div className="bg-white border rounded-2xl p-6 md:p-8 space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-bold text-dark flex items-center gap-2">
                <FaPlusCircle className="text-[#f1a33b]" /> List Freshers' Scholarship
              </h2>
              <p className="text-gray-500 text-xs mt-1">Publish new financial bursaries. The student portal matches score eligibility automatically.</p>
            </div>

            <form onSubmit={handlePublishScholarship} className="space-y-4">
              {schStatus && (
                <div className={`p-3 text-xs font-bold rounded-lg border ${schStatus.includes('Failed') ? 'bg-red-50 text-red-800 border-red-200' : 'bg-green-50 text-green-800 border-green-200'}`}>
                  {schStatus.includes('Failed') ? '⚠️' : '✓'} {schStatus}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Scholarship Title</label>
                  <input
                    type="text"
                    value={schTitle}
                    onChange={(e) => setSchTitle(e.target.value)}
                    placeholder="e.g. Chevron Freshers Scholarship"
                    className="w-full p-2.5 border rounded-lg bg-white text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Provider Foundation</label>
                  <input
                    type="text"
                    value={schProvider}
                    onChange={(e) => setSchProvider(e.target.value)}
                    placeholder="Chevron Star Deep Water"
                    className="w-full p-2.5 border rounded-lg bg-white text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Worth / Value</label>
                  <input
                    type="text"
                    value={schWorth}
                    onChange={(e) => setSchWorth(e.target.value)}
                    placeholder="₦150,000 yearly"
                    className="w-full p-2.5 border rounded-lg bg-white text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Min JAMB score Cut-off</label>
                  <input
                    type="number"
                    value={schMinJamb}
                    onChange={(e) => setSchMinJamb(e.target.value)}
                    className="w-full p-2.5 border rounded-lg bg-white text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Application Deadline</label>
                  <input
                    type="date"
                    value={schDeadline}
                    onChange={(e) => setSchDeadline(e.target.value)}
                    className="w-full p-2.5 border rounded-lg bg-white text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Eligible Courses (comma separated)</label>
                <input
                  type="text"
                  value={schCourses}
                  onChange={(e) => setSchCourses(e.target.value)}
                  placeholder="Computer Science, Medicine, Pharmacy"
                  className="w-full p-2.5 border rounded-lg bg-white text-sm"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#032b44] hover:bg-[#054a73] text-white font-bold py-3 rounded-xl transition shadow-md"
              >
                Publish freshman scholarship
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
