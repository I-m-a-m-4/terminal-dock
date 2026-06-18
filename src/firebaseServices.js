/**
 * firebaseServices.js
 * All reads and writes go directly to Firestore.
 * No localStorage seeds. No dummy data.
 */
import {
  collection, addDoc, getDocs, getDoc, doc,
  query, orderBy, where, updateDoc, deleteDoc,
  serverTimestamp, increment, arrayUnion, arrayRemove,
  onSnapshot, limit
} from 'firebase/firestore';
import { db } from '../firebase';

// ─── NEWS HUB ────────────────────────────────────────────────────────────────

export const getNews = async (userProfile = null) => {
  try {
    const q = query(collection(db, 'news_hub'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    const news = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return sortNewsByProfile(news, userProfile);
  } catch (err) {
    console.error('getNews error:', err);
    return [];
  }
};

export const subscribeToNews = (userProfile, callback) => {
  const q = query(collection(db, 'news_hub'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    const news = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(sortNewsByProfile(news, userProfile));
  });
};

export const publishNews = async (newsData) => {
  return addDoc(collection(db, 'news_hub'), {
    ...newsData,
    createdAt: serverTimestamp()
  });
};

export const deleteNews = async (newsId) => {
  await deleteDoc(doc(db, 'news_hub', newsId));
};

function sortNewsByProfile(news, userProfile) {
  if (!userProfile || (!userProfile.targetInstitution && !userProfile.intendedCourse)) return news;
  const { targetInstitution, intendedCourse } = userProfile;
  return [...news].sort((a, b) => {
    const aI = targetInstitution && a.category?.toLowerCase().includes(targetInstitution.toLowerCase());
    const bI = targetInstitution && b.category?.toLowerCase().includes(targetInstitution.toLowerCase());
    const aC = intendedCourse && a.targetCourses?.some(c => c.toLowerCase().includes(intendedCourse.toLowerCase()));
    const bC = intendedCourse && b.targetCourses?.some(c => c.toLowerCase().includes(intendedCourse.toLowerCase()));
    return ((bI ? 3 : 0) + (bC ? 2 : 0)) - ((aI ? 3 : 0) + (aC ? 2 : 0));
  });
}

// ─── FORUM POSTS ─────────────────────────────────────────────────────────────

export const subscribeToForumPosts = (callback) => {
  const q = query(collection(db, 'forum_posts'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};

export const getForumPosts = async () => {
  const q = query(collection(db, 'forum_posts'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const createForumPost = async (title, content, authorName, authorProfile, category) => {
  const ref = await addDoc(collection(db, 'forum_posts'), {
    title, content, authorName, authorProfile, category,
    upvotes: 0,
    votedUsers: [],
    repliesCount: 0,
    createdAt: serverTimestamp()
  });
  return { id: ref.id, title, content, authorName, authorProfile, category, upvotes: 0, votedUsers: [], repliesCount: 0 };
};

export const deleteForumPost = async (postId) => {
  await deleteDoc(doc(db, 'forum_posts', postId));
};

export const toggleUpvote = async (postId, uid) => {
  const ref = doc(db, 'forum_posts', postId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data();
  const voted = (data.votedUsers || []).includes(uid);
  await updateDoc(ref, {
    upvotes: increment(voted ? -1 : 1),
    votedUsers: voted ? arrayRemove(uid) : arrayUnion(uid)
  });
  return { upvotes: data.upvotes + (voted ? -1 : 1), voted: !voted };
};

// ─── FORUM REPLIES ────────────────────────────────────────────────────────────

export const subscribeToReplies = (postId, callback) => {
  const q = query(
    collection(db, 'forum_replies'),
    where('postId', '==', postId),
    orderBy('createdAt', 'asc')
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};

export const createReply = async (postId, content, authorName, authorProfile) => {
  const ref = await addDoc(collection(db, 'forum_replies'), {
    postId, content, authorName, authorProfile,
    createdAt: serverTimestamp()
  });
  // Increment repliesCount
  await updateDoc(doc(db, 'forum_posts', postId), { repliesCount: increment(1) });
  return { id: ref.id, postId, content, authorName, authorProfile };
};

// ─── TUTORS ──────────────────────────────────────────────────────────────────

export const getTutors = async () => {
  const snap = await getDocs(collection(db, 'tutors'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const subscribeTutors = (callback) => {
  return onSnapshot(collection(db, 'tutors'), (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};

export const createTutor = async (tutorData) => {
  return addDoc(collection(db, 'tutors'), { ...tutorData, createdAt: serverTimestamp() });
};

export const deleteTutor = async (tutorId) => {
  await deleteDoc(doc(db, 'tutors', tutorId));
};

// ─── MENTORSHIP BOOKINGS ──────────────────────────────────────────────────────

export const bookConsultation = async (bookingData) => {
  const ref = await addDoc(collection(db, 'mentorship_bookings'), {
    ...bookingData,
    status: 'Confirmed',
    createdAt: serverTimestamp()
  });
  return { id: ref.id, ...bookingData, status: 'Confirmed' };
};

export const getUserBookings = async (uid) => {
  const q = query(collection(db, 'mentorship_bookings'), where('studentUid', '==', uid));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getAllBookings = async () => {
  const q = query(collection(db, 'mentorship_bookings'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const updateBookingStatus = async (bookingId, status) => {
  await updateDoc(doc(db, 'mentorship_bookings', bookingId), { status });
};

// ─── SCHOLARSHIPS ─────────────────────────────────────────────────────────────

export const subscribeToScholarships = (callback) => {
  const q = query(collection(db, 'scholarships'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};

export const getScholarships = async () => {
  const q = query(collection(db, 'scholarships'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const publishScholarship = async (data) => {
  return addDoc(collection(db, 'scholarships'), { ...data, createdAt: serverTimestamp() });
};

export const deleteScholarship = async (id) => {
  await deleteDoc(doc(db, 'scholarships', id));
};

// ─── CBT RESULTS ──────────────────────────────────────────────────────────────

export const saveCbtResult = async (uid, result) => {
  return addDoc(collection(db, 'cbt_results'), {
    uid,
    ...result,
    createdAt: serverTimestamp()
  });
};

export const getCbtResults = async (uid) => {
  const q = query(
    collection(db, 'cbt_results'),
    where('uid', '==', uid),
    orderBy('createdAt', 'desc'),
    limit(10)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// ─── USER PROFILE ─────────────────────────────────────────────────────────────

export const updateSyllabusProgress = async (uid, topicId, checked) => {
  const ref = doc(db, 'user_profiles', uid);
  await updateDoc(ref, {
    [`syllabusProgress.${topicId}`]: checked
  });
};

// ─── ADMIN STATS ──────────────────────────────────────────────────────────────

export const getAdminStats = async () => {
  const [newsSnap, forumsSnap, bookingsSnap, scholSnap, tutorsSnap] = await Promise.all([
    getDocs(collection(db, 'news_hub')),
    getDocs(collection(db, 'forum_posts')),
    getDocs(collection(db, 'mentorship_bookings')),
    getDocs(collection(db, 'scholarships')),
    getDocs(collection(db, 'tutors'))
  ]);
  return {
    news: newsSnap.size,
    forums: forumsSnap.size,
    bookings: bookingsSnap.size,
    scholarships: scholSnap.size,
    tutors: tutorsSnap.size
  };
};
