import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaSearch, FaUserTie } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { subscribeToNews } from '../../firebaseServices';

const VerifiedNews = () => {
  const { userProfile } = useAuth();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!userProfile) return;
    const unsubscribe = subscribeToNews(userProfile, (data) => {
      setNews(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [userProfile]);

  const filteredNews = news.filter(item => 
    item.title.toLowerCase().includes(search.toLowerCase()) || 
    item.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black text-[#032b44]">Verified News Hub</h2>
          <p className="text-gray-500 text-sm mt-1">Official updates from universities and campus reps.</p>
        </div>
        <div className="relative w-full md:w-64">
          <FaSearch className="absolute left-3 top-3.5 text-gray-400 text-sm" />
          <input 
            type="text" 
            placeholder="Search news..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm focus:border-[#032b44] focus:outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-10 text-center text-gray-500 font-bold">Loading news...</div>
      ) : filteredNews.length === 0 ? (
        <div className="py-10 text-center text-gray-500 font-bold">No news articles found.</div>
      ) : (
        <div className="space-y-4">
          {filteredNews.map((item) => (
            <div key={item.id} className="border border-gray-150 rounded-xl p-5 hover:shadow-md transition relative overflow-hidden group">
              <div className={`absolute top-0 left-0 w-1.5 h-full ${item.status === 'Verified' ? 'bg-green-500' : 'bg-red-500'}`} />
              <div className="flex justify-between items-start">
                <div className="pr-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{item.category}</span>
                    {item.isCampusRep && (
                      <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <FaUserTie /> Campus Rep Update
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-dark text-lg group-hover:text-[#032b44] transition">{item.title}</h3>
                  <p className="text-gray-600 text-sm mt-2 leading-relaxed">{item.content}</p>
                  
                  {item.targetCourses && item.targetCourses.length > 0 && (
                    <div className="mt-3 flex gap-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Tags:</span>
                      {item.targetCourses.map((c, i) => (
                        <span key={i} className="text-[10px] font-bold text-[#032b44] bg-[#032b44]/5 px-2 py-0.5 rounded-full">
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  {item.status === 'Verified' ? (
                    <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                      <FaCheckCircle className="text-sm" />
                      <span className="text-xs font-bold uppercase tracking-wider">Verified</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-red-600 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">
                      <FaExclamationTriangle className="text-sm" />
                      <span className="text-xs font-bold uppercase tracking-wider">Unverified</span>
                    </div>
                  )}
                  <span className="block text-[10px] font-bold text-gray-400 mt-2">
                    {item.createdAt?.toDate().toLocaleDateString() || 'Just now'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VerifiedNews;
