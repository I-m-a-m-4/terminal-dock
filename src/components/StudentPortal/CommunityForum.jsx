import React, { useState, useEffect } from 'react';
import { FaFire, FaRegComment, FaArrowUp, FaPlus, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { 
  subscribeToForumPosts, subscribeToReplies, 
  createForumPost, createReply, toggleUpvote 
} from '../../firebaseServices';

const CommunityForum = () => {
  const { currentUser, userProfile } = useAuth();
  const [posts, setPosts] = useState([]);
  const [activePost, setActivePost] = useState(null);
  const [isComposing, setIsComposing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('Admission');

  useEffect(() => {
    const unsubscribe = subscribeToForumPosts((data) => {
      setPosts(data);
      setLoading(false);
      // Refresh active post data if open
      if (activePost) {
        const updated = data.find(p => p.id === activePost.id);
        if (updated) setActivePost(prev => ({ ...prev, ...updated }));
      }
    });
    return () => unsubscribe();
  }, [activePost?.id]); // Note dependency for activePost update

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim() || !userProfile) return;
    await createForumPost(newTitle, newContent, userProfile.displayName, userProfile.targetInstitution, newCategory);
    setNewTitle('');
    setNewContent('');
    setIsComposing(false);
  };

  const handleUpvote = async (e, postId) => {
    e.stopPropagation();
    if (!currentUser) return;
    await toggleUpvote(postId, currentUser.uid);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm min-h-[600px] flex flex-col relative">
      {!activePost ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-black text-[#032b44]">Nairaland Peer Forum</h2>
              <p className="text-gray-500 text-sm mt-1">Discuss admissions, share study materials, and ask mentors.</p>
            </div>
            <button 
              onClick={() => setIsComposing(true)}
              className="bg-[#032b44] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#054a73] transition"
            >
              <FaPlus /> New Topic
            </button>
          </div>

          {isComposing && (
            <div className="mb-6 p-4 border border-gray-200 rounded-xl bg-gray-50 animate-fadeIn">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-dark text-sm">Create New Topic</h3>
                <button onClick={() => setIsComposing(false)} className="text-gray-400 hover:text-red-500"><FaTimes /></button>
              </div>
              <form onSubmit={handlePostSubmit} className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Topic Title..."
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full p-2.5 border rounded-lg text-sm font-bold focus:outline-none focus:border-[#032b44]"
                  required
                />
                <div className="flex gap-2">
                  <select 
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="p-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:border-[#032b44]"
                  >
                    <option value="Admission">Admission</option>
                    <option value="Post-UTME">Post-UTME</option>
                    <option value="General">General</option>
                    <option value="Subject Setup">Subject Setup</option>
                  </select>
                </div>
                <textarea 
                  placeholder="What's on your mind? Be descriptive..."
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  className="w-full p-2.5 border rounded-lg text-sm h-24 resize-none focus:outline-none focus:border-[#032b44]"
                  required
                />
                <div className="text-right">
                  <button type="submit" className="bg-[#f1a33b] text-white font-bold py-2 px-6 rounded-lg text-sm hover:opacity-90">Post Topic</button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
             <div className="text-center py-10 font-bold text-gray-500">Loading topics...</div>
          ) : (
            <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
              {posts.map(post => {
                const isUpvoted = currentUser && (post.votedUsers || []).includes(currentUser.uid);
                return (
                  <div 
                    key={post.id}
                    onClick={() => setActivePost(post)}
                    className="border border-gray-150 rounded-xl p-4 hover:border-[#032b44] hover:shadow-sm transition cursor-pointer flex gap-4"
                  >
                    <div className="flex flex-col items-center shrink-0">
                      <button 
                        onClick={(e) => handleUpvote(e, post.id)}
                        className={`p-2 rounded-lg transition ${isUpvoted ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                      >
                        <FaArrowUp />
                      </button>
                      <span className={`text-xs font-bold mt-1 ${isUpvoted ? 'text-orange-600' : 'text-gray-500'}`}>{post.upvotes || 0}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded uppercase">{post.category}</span>
                        {post.upvotes > 10 && <span className="text-[10px] font-bold text-red-500 flex items-center gap-1"><FaFire /> Trending</span>}
                      </div>
                      <h3 className="font-bold text-dark text-base">{post.title}</h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{post.content}</p>
                      <div className="flex items-center gap-4 mt-3 text-[10px] text-gray-400 font-bold">
                        <span>By {post.authorName} ({post.authorProfile || 'Student'})</span>
                        <span>{post.createdAt?.toDate().toLocaleDateString() || 'Just now'}</span>
                        <span className="flex items-center gap-1"><FaRegComment /> {post.repliesCount || 0} Replies</span>
                      </div>
                    </div>
                  </div>
                )
              })}
              {posts.length === 0 && (
                <div className="text-center py-10 font-bold text-gray-500">No topics yet. Start the conversation!</div>
              )}
            </div>
          )}
        </>
      ) : (
        <PostThread 
          post={activePost} 
          onBack={() => setActivePost(null)} 
          currentUser={currentUser}
          userProfile={userProfile}
        />
      )}
    </div>
  );
};

const PostThread = ({ post, onBack, currentUser, userProfile }) => {
  const [replies, setReplies] = useState([]);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeToReplies(post.id, (data) => {
      setReplies(data);
    });
    return () => unsubscribe();
  }, [post.id]);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !userProfile) return;
    await createReply(post.id, replyText, userProfile.displayName, userProfile.targetInstitution);
    setReplyText('');
  };

  return (
    <div className="flex flex-col h-full animate-fadeIn">
      <button onClick={onBack} className="text-xs font-bold text-gray-500 hover:text-[#032b44] mb-4 flex items-center gap-1 w-fit">
        ← Back to all topics
      </button>

      <div className="border border-gray-200 bg-gray-50 rounded-xl p-5 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold text-gray-400 bg-white border border-gray-200 px-2 py-0.5 rounded uppercase">{post.category}</span>
        </div>
        <h2 className="text-xl font-bold text-[#032b44] mb-3">{post.title}</h2>
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>
        <div className="mt-4 pt-3 border-t border-gray-200 flex items-center gap-3 text-xs font-bold text-gray-400">
          <div className="w-6 h-6 bg-[#032b44] text-white rounded-full flex items-center justify-center text-[10px]">{post.authorName[0]}</div>
          <span>{post.authorName}</span>
          <span className="text-gray-300">•</span>
          <span>{post.createdAt?.toDate().toLocaleString() || 'Just now'}</span>
        </div>
      </div>

      <h3 className="font-bold text-sm text-dark mb-3 flex items-center gap-2"><FaRegComment /> {post.repliesCount || 0} Replies</h3>
      
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
        {replies.map(reply => (
          <div key={reply.id} className="border-l-2 border-[#f1a33b] bg-white p-3 rounded-r-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-[10px] font-bold text-gray-400">
              <div className="w-5 h-5 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center">{reply.authorName[0]}</div>
              <span className="text-[#032b44]">{reply.authorName}</span>
              <span>{reply.createdAt?.toDate().toLocaleString() || 'Just now'}</span>
            </div>
            <p className="text-xs text-gray-700">{reply.content}</p>
          </div>
        ))}
        {replies.length === 0 && (
          <p className="text-xs text-gray-400 italic">No replies yet. Be the first!</p>
        )}
      </div>

      <form onSubmit={handleReplySubmit} className="mt-auto flex gap-2">
        <input
          type="text"
          placeholder="Write a reply..."
          value={replyText}
          onChange={e => setReplyText(e.target.value)}
          className="flex-1 p-3 border rounded-xl text-sm focus:outline-none focus:border-[#032b44]"
          required
        />
        <button type="submit" className="bg-[#032b44] text-white font-bold px-6 py-3 rounded-xl text-sm hover:bg-[#054a73] transition">
          Reply
        </button>
      </form>
    </div>
  );
};

export default CommunityForum;
