import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Hero from "./components/Hero/Hero";
import Services from "./components/Services/Services";
import Blog from "./components/Blog/Blog";
import BlogPost1 from "./components/Blog/BlogPost1";
import BlogPost2 from "./components/Blog/BlogPost2";
import BlogPost3 from "./components/Blog/BlogPost3";
import BlogPost4 from "./components/Blog/BlogPost4";
import BlogPost5 from "./components/Blog/BlogPost5";
import Banner from "./components/Banner/Banner";
import Subscribe from "./components/Subscribe/Subscribe";
import Banner2 from "./components/Banner/Banner2";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import AboutUs from "./components/AboutUs/AboutUs";
import Whoweare from "./components/AboutUs/Whoweare";
import OurServices from "./components/OurServices/OurServices";
import StudyMaterials from "./components/StudyMaterials/StudyMaterials";
import LatestNews from "./components/Blog/LatestNews";
import PortalDashboard from "./components/StudentPortal/PortalDashboard";
import AdminDashboard from "./components/StudentPortal/AdminDashboard";
import AuthPage from "./components/Auth/AuthPage";

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  return children;
};

const AppRoutes = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <main className="overflow-x-hidden bg-white text-dark">
      {!isHome && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/our-services" element={<OurServices />} />
        <Route path="/study-materials" element={<StudyMaterials />} />
        <Route path="/latest-news" element={<LatestNews />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/portal" element={
          <ProtectedRoute><PortalDashboard /></ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/blog/1" element={<BlogPost1 />} />
        <Route path="/blog/2" element={<BlogPost2 />} />
        <Route path="/blog/3" element={<BlogPost3 />} />
        <Route path="/blog/4" element={<BlogPost4 />} />
        <Route path="/blog/5" element={<BlogPost5 />} />
      </Routes>
      {!isHome && <Footer />}
    </main>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;