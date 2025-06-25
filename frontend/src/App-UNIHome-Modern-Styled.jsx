// UNI Home - App con Stili Moderni Inline
import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, useLocation } from "react-router-dom";
import UNIHomeAuthPage from './pages/UNIHomeAuthPage-Fixed.jsx';
import CreateAnnouncementModern from './components/CreateAnnouncementModern.jsx';
import AnnouncementDetail from './components/AnnouncementDetail.jsx';

// Stili moderni inline
const modernStyles = {
  body: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    margin: 0,
    padding: 0,
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    minHeight: '100vh'
  },
  
  pageContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #eff6ff 0%, #eef2ff 50%, #faf5ff 100%)',
    padding: '2rem 1rem'
  },
  
  modernCard: {
    background: 'linear-gradient(135deg, white 0%, #f8fafc 100%)',
    border: '1px solid #e2e8f0',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer'
  },
  
  cardGradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)'
  },
  
  titleGradient: {
    fontSize: '20px',
    fontWeight: '700',
    marginBottom: '12px',
    background: 'linear-gradient(135deg, #1f2937, #374151)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  
  badgeLocation: {
    background: '#f3f4f6',
    padding: '6px 12px',
    borderRadius: '20px',
    color: '#6b7280',
    fontWeight: '500',
    fontSize: '13px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px'
  },
  
  badgePrice: {
    background: 'linear-gradient(135deg, #059669, #10b981)',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '20px',
    fontWeight: '700',
    fontSize: '14px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px'
  },
  
  modernBtn: {
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '12px',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '14px',
    width: '100%',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
  },
  
  modernBtnGreen: {
    background: 'linear-gradient(135deg, #16a34a, #059669)',
    boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)'
  },
  
  listingsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '24px',
    marginTop: '32px',
    maxWidth: '1200px',
    margin: '32px auto 0'
  },
  
  navbar: {
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    padding: '16px 24px',
    boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
    borderRadius: '0 0 16px 16px'
  },
  
  navLink: {
    color: 'white',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    fontWeight: '500'
  }
};

// Context per l'autenticazione
const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      isAuthenticated: !!localStorage.getItem('authToken'),
      user: localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : null,
      login: (userData, token) => {
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(userData));
        window.location.reload();
      },
      logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.href = '/';
      },
      loading: false
    };
  }
  return context;
};

// Provider per l'autenticazione
const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Errore parsing userData:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Navbar moderna
const ModernNavbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav style={modernStyles.navbar}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div 
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            fontSize: '24px',
            fontWeight: '800',
            color: 'white'
          }}
        >
          🏠 UNI Home
        </div>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <a href="#" onClick={() => navigate('/listings')} style={modernStyles.navLink}>
            🔍 Cerca
          </a>
          
          {isAuthenticated ? (
            <>
              <a href="#" onClick={() => navigate('/publish')} style={modernStyles.navLink}>
                📝 Pubblica
              </a>
              <a href="#" onClick={() => navigate('/dashboard')} style={modernStyles.navLink}>
                📊 Dashboard
              </a>
              <button 
                onClick={logout}
                style={{
                  ...modernStyles.navLink,
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                👋 Logout
              </button>
            </>
          ) : (
            <a href="#" onClick={() => navigate('/auth')} style={modernStyles.navLink}>
              🔑 Login
            </a>
          )}
        </div>
      </div>
    </nav>
  );
};

// Homepage moderna
const Homepage = () => {
  const navigate = useNavigate();
  
  return (
    <div style={modernStyles.pageContainer}>
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', padding: '60px 20px' }}>
        <div style={{ fontSize: '6rem', marginBottom: '2rem' }}>🏠</div>
        <h1 style={{
          fontSize: '4rem',
          fontWeight: '800',
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Benvenuto in UNI Home
        </h1>
        <p style={{
          fontSize: '1.3rem',
          color: '#6b7280',
          marginBottom: '3rem',
          lineHeight: '1.7'
        }}>
          La piattaforma più moderna per trovare e offrire alloggi universitari.
          Connetti studenti e proprietari in tutta Italia! 🇮🇹
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={() => navigate('/listings')}
            style={{
              ...modernStyles.modernBtn,
              width: 'auto',
              padding: '16px 32px',
              fontSize: '16px'
            }}
          >
            🔍 Cerca Alloggi
          </button>
          <button 
            onClick={() => navigate('/auth')}
            style={{
              ...modernStyles.modernBtn,
              ...modernStyles.modernBtnGreen,
              width: 'auto',
              padding: '16px 32px',
              fontSize: '16px'
            }}
          >
            🚀 Inizia Ora
          </button>
        </div>
      </div>
    </div>
  );
};

// Pagina listing moderna
const ListingsPage = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setError('');
      const response = await fetch('http://localhost:5000/api/announcements');
      
      if (response.ok) {
        const data = await response.json();
        const announcementsArray = data.announcements || data;
        setListings(Array.isArray(announcementsArray) ? announcementsArray : []);
      } else {
        setError(`Errore server: ${response.status}`);
      }
    } catch (error) {
      console.error('Errore caricamento annunci:', error);
      setError('Errore di connessione al server');
    } finally {
      setLoading(false);
    }
  };

  const handleCardHover = (e, isHover) => {
    if (isHover) {
      e.currentTarget.style.transform = 'translateY(-8px)';
      e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
    } else {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.08)';
    }
  };

  const handleButtonHover = (e, isHover) => {
    if (isHover) {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 8px 20px rgba(99, 102, 241, 0.4)';
    } else {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
    }
  };

  if (loading) {
    return (
      <div style={modernStyles.pageContainer}>
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #6366f1',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 24px'
          }}></div>
          <h2 style={{ color: '#6b7280', fontSize: '1.5rem' }}>🔍 Caricamento annunci...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={modernStyles.pageContainer}>
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <h2 style={{ color: '#ef4444', fontSize: '1.5rem', marginBottom: '16px' }}>❌ {error}</h2>
          <button 
            onClick={fetchListings}
            style={modernStyles.modernBtn}
          >
            🔄 Riprova
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={modernStyles.pageContainer}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: '800',
          marginBottom: '16px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          🔍 Trova la Tua Casa
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#6b7280' }}>
          Esplora centinaia di annunci verificati in tutta Italia
        </p>
      </div>
      
      {listings.length === 0 ? (
        <div style={{
          ...modernStyles.modernCard,
          maxWidth: '600px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📋</div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Nessun Annuncio Trovato</h3>
          <p style={{ color: '#6b7280' }}>Al momento non ci sono annunci disponibili. Torna più tardi!</p>
        </div>
      ) : (
        <div style={modernStyles.listingsGrid}>
          {listings.map((listing) => (
            <div 
              key={listing.id} 
              style={modernStyles.modernCard}
              onMouseEnter={(e) => handleCardHover(e, true)}
              onMouseLeave={(e) => handleCardHover(e, false)}
              onClick={() => navigate(`/annuncio/${listing.id}`)}
            >
              <div style={modernStyles.cardGradientTop}></div>
              
              <h3 style={modernStyles.titleGradient}>
                🏠 {listing.titolo}
              </h3>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px',
                flexWrap: 'wrap'
              }}>
                <span style={modernStyles.badgeLocation}>
                  📍 {listing.citta || listing.città}
                </span>
                <span style={modernStyles.badgePrice}>
                  💰 €{listing.prezzo}/mese
                </span>
              </div>
              
              <p style={{
                color: '#6b7280',
                lineHeight: '1.5',
                marginBottom: '20px',
                fontSize: '14px'
              }}>
                {listing.descrizione?.substring(0, 100)}...
              </p>
              
              <button 
                style={modernStyles.modernBtn}
                onMouseEnter={(e) => handleButtonHover(e, true)}
                onMouseLeave={(e) => handleButtonHover(e, false)}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/annuncio/${listing.id}`);
                }}
              >
                ✨ Vedi Dettagli
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Componente protetto
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ ...modernStyles.pageContainer, textAlign: 'center', padding: '80px 20px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #e5e7eb',
          borderTop: '3px solid #6366f1',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px'
        }}></div>
        <p>Verifica autenticazione...</p>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
};

// Page per creare annunci
const CreateAnnouncementPage = () => {
  return <CreateAnnouncementModern />;
};

// Placeholder per altre pagine
const Dashboard = () => (
  <div style={modernStyles.pageContainer}>
    <h1>📊 Dashboard - Coming Soon!</h1>
  </div>
);

const MessagesPage = () => (
  <div style={modernStyles.pageContainer}>
    <h1>💬 Messaggi - Coming Soon!</h1>
  </div>
);

const ProfilePage = () => (
  <div style={modernStyles.pageContainer}>
    <h1>👤 Profilo - Coming Soon!</h1>
  </div>
);

// App principale
const App = () => {
  useEffect(() => {
    // Applica stili globali al body
    Object.assign(document.body.style, modernStyles.body);
    
    // Aggiungi keyframes CSS
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-10px); }
        60% { transform: translateY(-5px); }
      }
    `;
    document.head.appendChild(styleSheet);
  }, []);

  return (
    <AuthProvider>
      <Router>
        <ModernNavbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/auth" element={<UNIHomeAuthPage />} />
          <Route path="/listings" element={<ListingsPage />} />
          <Route path="/annuncio/:id" element={<AnnouncementDetail />} />
          <Route path="/publish" element={
            <ProtectedRoute>
              <CreateAnnouncementPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/messages" element={
            <ProtectedRoute>
              <MessagesPage />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
