import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    setLoggedIn(!!token);
    if (userData) {
      setUser(JSON.parse(userData));
    }

    if (token) {
      // Fetch notifications count (se implementato nel backend)
      axios
        .get("http://localhost:5000/api/messages/unread-count", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setNotificationCount(res.data.unreadCount || 0);
        })
        .catch((err) => {
          console.error("Errore nel recupero notifiche:", err);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setLoggedIn(false);
    setUser(null);
    setNotificationCount(0);
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 rounded-lg">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
              </svg>
            </div>
            <span className="text-2xl font-bold text-gray-900">AlloggiFinder</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {loggedIn ? (
              <>
                <Link 
                  to="/crea" 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all"
                >
                  Pubblica Annuncio
                </Link>
                <Link 
                  to="/i-miei-annunci" 
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  I miei annunci
                </Link>                <Link 
                  to="/inbox" 
                  className="relative text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Messaggi
                  {notificationCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                  )}
                </Link>
                
                <Link 
                  to="/test" 
                  className="text-orange-600 hover:text-orange-700 font-medium transition-colors border border-orange-200 px-3 py-1 rounded-lg hover:border-orange-300"
                >
                  🧪 Test
                </Link>
                
                {/* User Profile Dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-medium">
                      {user?.nome?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="font-medium">{user?.nome || 'Utente'}</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    <div className="py-2">
                      <Link 
                        to="/profilo" 
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        Il mio profilo
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <Link 
                to="/auth" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                Accedi / Registrati
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {loggedIn ? (
                <>
                  <Link 
                    to="/crea" 
                    className="block px-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Pubblica Annuncio
                  </Link>
                  <Link 
                    to="/i-miei-annunci" 
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    I miei annunci
                  </Link>
                  <Link 
                    to="/inbox" 
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors relative"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Messaggi
                    {notificationCount > 0 && (
                      <span className="absolute right-4 top-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {notificationCount > 9 ? '9+' : notificationCount}
                      </span>
                    )}
                  </Link>
                  <Link 
                    to="/profilo" 
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profilo
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link 
                  to="/auth" 
                  className="block px-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Accedi / Registrati
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}