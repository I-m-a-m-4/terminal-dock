import React, { useState } from "react";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import pinnacle from "../../assets/erc.png";

const NavbarMenu = [
  { id: 1, title: "Home", path: "/" },
  { id: 2, title: "About Us", path: "/about-us" },
  { id: 3, title: "Our Services", path: "/our-services" },
  { id: 4, title: "Study Materials", path: "/study-materials" },
  { id: 5, title: "Latest News", path: "/latest-news" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, userProfile, logout } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav className="relative z-20 bg-white shadow-sm">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container py-3 flex justify-between items-center"
      >
        {/* Logo section */}
        <Link to="/" className="flex items-center gap-3">
          <img src={pinnacle} alt="Pinnacle Academia logo" className="w-12 h-12 lg:w-16 lg:h-16" />
          <h1 className="font-bold text-xl md:text-2xl text-[#032b44] whitespace-nowrap">
            Pinnacle Academia
          </h1>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6">
          <ul className="flex items-center gap-4">
            {NavbarMenu.map((menu) => (
              <li key={menu.id}>
                <Link
                  to={menu.path}
                  className={`relative font-semibold transition-colors px-2 py-1 ${
                    location.pathname === menu.path ? "text-[#f1a33b]" : "text-gray-600 hover:text-[#032b44]"
                  }`}
                >
                  {menu.title}
                  {location.pathname === menu.path && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-[#f1a33b] rounded-full"
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Auth Section */}
          <div className="pl-4 border-l border-gray-200">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-full transition border border-gray-200"
                >
                  {userProfile?.photoURL ? (
                    <img src={userProfile.photoURL} alt="Profile" className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <FaUserCircle className="text-gray-400 text-xl" />
                  )}
                  <span className="font-bold text-sm text-[#032b44] max-w-[100px] truncate">
                    {userProfile?.displayName || currentUser.email.split('@')[0]}
                  </span>
                </button>

                {/* Dropdown */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2"
                    >
                      <Link
                        to="/portal"
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#032b44] font-semibold"
                      >
                        🎓 Student Portal
                      </Link>
                      {currentUser.email === "admin@pinnacle.com" && (
                        <Link
                          to="/admin"
                          onClick={() => setIsDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#032b44] font-semibold"
                        >
                          🛡️ Admin Panel
                        </Link>
                      )}
                      <hr className="my-2 border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-semibold flex items-center gap-2"
                      >
                        <FaSignOutAlt /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login">
                <button className="bg-[#032b44] hover:bg-[#054a73] text-white font-bold py-2 px-6 rounded-full transition shadow-md">
                  Login / Sign Up
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Hamburger */}
        <div className="lg:hidden flex items-center gap-4">
          {!currentUser && (
            <Link to="/login" className="text-sm font-bold text-[#032b44]">Login</Link>
          )}
          <button onClick={toggleMenu} className="text-[#032b44]">
            {isMenuOpen ? <IoMdClose className="text-3xl" /> : <IoMdMenu className="text-3xl" />}
          </button>
        </div>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <ul className="flex flex-col px-4 py-2">
              {NavbarMenu.map((menu) => (
                <li key={menu.id}>
                  <Link
                    to={menu.path}
                    className={`block py-3 border-b border-gray-50 font-semibold ${
                      location.pathname === menu.path ? "text-[#f1a33b]" : "text-gray-600"
                    }`}
                    onClick={toggleMenu}
                  >
                    {menu.title}
                  </Link>
                </li>
              ))}
              
              {currentUser ? (
                <>
                  <li>
                    <Link
                      to="/portal"
                      className="block py-3 border-b border-gray-50 font-bold text-[#032b44]"
                      onClick={toggleMenu}
                    >
                      🎓 Student Portal
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => { handleLogout(); toggleMenu(); }}
                      className="w-full text-left py-3 font-bold text-red-600 flex items-center gap-2"
                    >
                      <FaSignOutAlt /> Sign Out
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    to="/login"
                    className="block py-3 font-bold text-[#032b44]"
                    onClick={toggleMenu}
                  >
                    Login / Sign Up
                  </Link>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;