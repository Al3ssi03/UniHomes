// UNI Home - App Completa con Sistema di Autenticazione e Navigazione FUNZIONANTE
import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, useLocation } from "react-router-dom";
import UNIHomeAuthPage from './pages/UNIHomeAuthPage-Fixed.jsx';

// Context per gestire l'autenticazione
const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Fallback se il context non è disponibile
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
    // Controlla se l'utente è già autenticato
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

// Design System UNI Home
const theme = {
  colors: {
    primary: '#6366f1',
    primaryDark: '#4f46e5',
    secondary: '#06b6d4',
    secondaryDark: '#0891b2',
    accent: '#f59e0b',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backgroundAlt: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
    surface: 'rgba(255, 255, 255, 0.95)',
    surfaceGlass: 'rgba(255, 255, 255, 0.1)',
    text: '#1f2937',
    textLight: '#6b7280',
    white: '#ffffff'
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    glow: '0 0 30px rgba(99, 102, 241, 0.3)'
  },
  transitions: {
    fast: 'all 0.15s ease',
    normal: 'all 0.3s ease',
    slow: 'all 0.5s ease'
  },
  borderRadius: {
    sm: '6px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px'
  }
};

// Stili per l'app
const styles = {
  container: {
    minHeight: '100vh',
    background: theme.colors.background,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    color: theme.colors.white
  },
  navbar: {
    background: theme.colors.surfaceGlass,
    backdropFilter: 'blur(20px) saturate(150%)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    transition: theme.transitions.normal
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    transition: theme.transitions.fast
  },
  logoIcon: {
    width: '40px',
    height: '40px',
    background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
    borderRadius: theme.borderRadius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    boxShadow: theme.shadows.glow,
    transition: theme.transitions.fast
  },
  logoText: {
    fontSize: '24px',
    fontWeight: '700',
    background: `linear-gradient(135deg, ${theme.colors.white}, ${theme.colors.secondary})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  navButtons: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
  },
  navMenu: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  button: {
    background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
    color: theme.colors.white,
    border: 'none',
    padding: '10px 20px',
    borderRadius: theme.borderRadius.md,
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: theme.transitions.fast,
    boxShadow: theme.shadows.md,
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px'
  },
  buttonOutline: {
    background: 'transparent',
    color: theme.colors.white,
    border: `2px solid ${theme.colors.surfaceGlass}`,
    padding: '8px 18px',
    borderRadius: theme.borderRadius.md,
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: theme.transitions.fast,
    backdropFilter: 'blur(10px)',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px'
  },
  pageContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
    textAlign: 'center'
  },
  pageTitle: {
    fontSize: 'clamp(2rem, 5vw, 3rem)',
    fontWeight: '800',
    marginBottom: '20px',
    background: `linear-gradient(135deg, ${theme.colors.white}, ${theme.colors.secondary})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  pageSubtitle: {
    fontSize: '1.2rem',
    opacity: 0.9,
    marginBottom: '40px',
    maxWidth: '600px',
    margin: '0 auto 40px auto'
  },
  card: {
    background: theme.colors.surfaceGlass,
    padding: '30px',
    borderRadius: theme.borderRadius.lg,
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    marginBottom: '20px',
    transition: theme.transitions.fast,
    cursor: 'pointer'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginTop: '40px'
  }
};

// Logo SVG UNI Home
const UNIHomeLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3L2 12h2v8h6v-6h4v6h6v-8h2L12 3z"/>
  </svg>
);

// Componente di protezione per route autenticate
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: `3px solid ${theme.colors.surfaceGlass}`,
          borderTop: `3px solid ${theme.colors.primary}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p>Caricamento...</p>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/auth" replace />;
};

// Navbar moderna con menu completo
const ModernNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo} onClick={() => navigate('/')}>
        <div style={styles.logoIcon}>
          <UNIHomeLogo />
        </div>
        <span style={styles.logoText}>UNI Home</span>
      </div>
      
      <div style={styles.navButtons}>
        {isAuthenticated ? (
          <div style={styles.navMenu}>
            <button
              style={location.pathname === '/dashboard' ? styles.button : styles.buttonOutline}
              onClick={() => handleNavigation('/dashboard')}
            >
              🏠 Dashboard
            </button>
            <button
              style={location.pathname === '/listings' ? styles.button : styles.buttonOutline}
              onClick={() => handleNavigation('/listings')}
            >
              🔍 Cerca
            </button>
            <button
              style={location.pathname === '/publish' ? styles.button : styles.buttonOutline}
              onClick={() => handleNavigation('/publish')}
            >
              📝 Pubblica
            </button>
            <button
              style={location.pathname === '/messages' ? styles.button : styles.buttonOutline}
              onClick={() => handleNavigation('/messages')}
            >
              💬 Messaggi
            </button>
            <button
              style={location.pathname === '/profile' ? styles.button : styles.buttonOutline}
              onClick={() => handleNavigation('/profile')}
            >
              👤 {user?.nome || 'Profilo'}
            </button>
            <button
              style={styles.button}
              onClick={handleLogout}
            >
              🚪 Logout
            </button>
          </div>
        ) : (
          <div style={styles.navMenu}>
            <button
              style={styles.buttonOutline}
              onClick={() => navigate('/auth')}
            >
              🔐 Accedi
            </button>
            <button
              style={styles.button}
              onClick={() => navigate('/auth')}
            >
              🚀 Registrati
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

// Homepage per utenti non autenticati
const Homepage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Se l'utente è autenticato, mostra la dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div style={styles.pageContent}>
      <h1 style={styles.pageTitle}>
        🏠 Benvenuto in UNI Home
      </h1>
      
      <p style={styles.pageSubtitle}>
        La piattaforma più moderna per trovare alloggi universitari. 
        Connettiti con altri studenti e trova la tua casa ideale.
      </p>
      
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          style={{
            ...styles.button,
            padding: '16px 32px',
            fontSize: '16px'
          }}
          onClick={() => navigate('/auth')}
        >
          🚀 Inizia Ora
        </button>
        <button
          style={{
            ...styles.buttonOutline,
            padding: '14px 30px',
            fontSize: '16px'
          }}
          onClick={() => navigate('/auth')}
        >
          🔍 Scopri di Più
        </button>
      </div>
      
      <div style={styles.grid}>
        <div style={styles.card}>
          <h3>🔍 Trova la Casa Perfetta</h3>
          <p>Cerca tra centinaia di annunci verificati</p>
        </div>
        <div style={styles.card}>
          <h3>💬 Connettiti con Studenti</h3>
          <p>Chat diretta con proprietari e coinquilini</p>
        </div>
        <div style={styles.card}>
          <h3>🛡️ Sicurezza Garantita</h3>
          <p>Tutti gli annunci sono verificati</p>
        </div>
      </div>
    </div>
  );
};

// Dashboard per utenti autenticati
const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={styles.pageContent}>
      <h1 style={styles.pageTitle}>
        👋 Ciao, {user?.nome || 'Studente'}!
      </h1>
      
      <p style={styles.pageSubtitle}>
        Benvenuto nella tua dashboard UNI Home
      </p>
      
      <div style={styles.grid}>
        <div style={styles.card} onClick={() => navigate('/listings')}>
          <h3>🔍 Cerca Case</h3>
          <p>Trova il tuo alloggio ideale</p>
          <button style={styles.button}>Inizia Ricerca</button>
        </div>
        <div style={styles.card} onClick={() => navigate('/publish')}>
          <h3>📝 Pubblica Annuncio</h3>
          <p>Condividi la tua casa</p>
          <button style={styles.button}>Crea Annuncio</button>
        </div>
        <div style={styles.card} onClick={() => navigate('/messages')}>
          <h3>💬 I Tuoi Messaggi</h3>
          <p>Gestisci le conversazioni</p>
          <button style={styles.button}>Apri Chat</button>
        </div>
      </div>
    </div>
  );
};

// Pagina di ricerca annunci
const ListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/announcements', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setListings(data);
      }
    } catch (error) {
      console.error('Errore caricamento annunci:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.pageContent}>
        <h1 style={styles.pageTitle}>🔍 Caricamento annunci...</h1>
      </div>
    );
  }

  return (
    <div style={styles.pageContent}>
      <h1 style={styles.pageTitle}>🔍 Cerca la Tua Casa</h1>
      
      <p style={styles.pageSubtitle}>
        Esplora centinaia di annunci verificati
      </p>
      
      {listings.length === 0 ? (
        <div style={styles.card}>
          <h3>📋 Nessun Annuncio Trovato</h3>
          <p>Al momento non ci sono annunci disponibili. Torna più tardi!</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {listings.map((listing) => (
            <div key={listing.id} style={styles.card}>
              <h3>🏠 {listing.titolo}</h3>
              <p><strong>📍</strong> {listing.città}</p>
              <p><strong>💰</strong> €{listing.prezzo}/mese</p>
              <p>{listing.descrizione?.substring(0, 100)}...</p>
              <button style={styles.button}>Vedi Dettagli</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Pagina per pubblicare annunci
const PublishPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titolo: '',
    descrizione: '',
    prezzo: '',
    città: '',
    indirizzo: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('✅ Annuncio pubblicato con successo!');
        navigate('/dashboard');
      } else {
        alert('❌ Errore nella pubblicazione dell\'annuncio');
      }
    } catch (error) {
      console.error('Errore:', error);
      alert('❌ Errore di connessione');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: theme.borderRadius.md,
    border: '1px solid rgba(255, 255, 255, 0.2)',
    background: 'rgba(255, 255, 255, 0.1)',
    color: theme.colors.white,
    fontSize: '16px',
    marginBottom: '15px'
  };

  return (
    <div style={styles.pageContent}>
      <h1 style={styles.pageTitle}>📝 Pubblica il tuo Annuncio</h1>
      
      <form onSubmit={handleSubmit} style={{
        ...styles.card,
        textAlign: 'left',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <input
          type="text"
          placeholder="Titolo annuncio (es: Stanza singola vicino università)"
          value={formData.titolo}
          onChange={(e) => setFormData({...formData, titolo: e.target.value})}
          style={inputStyle}
          required
        />
        
        <textarea
          placeholder="Descrizione dettagliata..."
          value={formData.descrizione}
          onChange={(e) => setFormData({...formData, descrizione: e.target.value})}
          style={{
            ...inputStyle,
            minHeight: '100px',
            resize: 'vertical'
          }}
          required
        />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <input
            type="number"
            placeholder="Prezzo (€/mese)"
            value={formData.prezzo}
            onChange={(e) => setFormData({...formData, prezzo: e.target.value})}
            style={inputStyle}
            required
          />
          
          <input
            type="text"
            placeholder="Città"
            value={formData.città}
            onChange={(e) => setFormData({...formData, città: e.target.value})}
            style={inputStyle}
            required
          />
        </div>

        <input
          type="text"
          placeholder="Indirizzo"
          value={formData.indirizzo}
          onChange={(e) => setFormData({...formData, indirizzo: e.target.value})}
          style={inputStyle}
          required
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.button,
            width: '100%',
            padding: '16px',
            fontSize: '16px',
            fontWeight: '700',
            justifyContent: 'center'
          }}
        >
          {loading ? '📤 Pubblicazione...' : '🚀 Pubblica Annuncio'}
        </button>
      </form>
    </div>
  );
};

// Pagina messaggi
const MessagesPage = () => {
  return (
    <div style={styles.pageContent}>
      <h1 style={styles.pageTitle}>💬 I Tuoi Messaggi</h1>
      
      <p style={styles.pageSubtitle}>
        Gestisci le conversazioni con proprietari e coinquilini
      </p>
      
      <div style={styles.card}>
        <h3>📧 Centro Messaggi</h3>
        <p>La funzione di messaggistica sarà disponibile presto!</p>
        <p>Per ora puoi contattare direttamente i proprietari tramite telefono.</p>
      </div>
    </div>
  );
};

// Pagina profilo utente
const ProfilePage = () => {
  const { user } = useAuth();
  
  return (
    <div style={styles.pageContent}>
      <h1 style={styles.pageTitle}>👤 Il Tuo Profilo</h1>
      
      <div style={{
        ...styles.card,
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto',
            fontSize: '2rem'
          }}>
            👤
          </div>
          <h2>{user?.nome} {user?.cognome}</h2>
          <p style={{ opacity: 0.8 }}>@{user?.username}</p>
        </div>
        
        <div style={{ display: 'grid', gap: '15px', textAlign: 'left' }}>
          <div style={{
            padding: '15px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: theme.borderRadius.md
          }}>
            <strong>📧 Email:</strong> {user?.username}
          </div>
          
          <div style={{
            padding: '15px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: theme.borderRadius.md
          }}>
            <strong>📱 Telefono:</strong> {user?.telefono || 'Non specificato'}
          </div>
          
          <div style={{
            padding: '15px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: theme.borderRadius.md
          }}>
            <strong>🎂 Anno di Nascita:</strong> {user?.anno_nascita || 'Non specificato'}
          </div>
        </div>
      </div>
    </div>
  );
};

// App principale con routing completo
export default function UNIHomeApp() {
  console.log("🏠 UNI Home - App Completa con Autenticazione FUNZIONANTE");
  
  return (
    <AuthProvider>
      <div style={styles.container}>
        <Router>
          <ModernNavbar />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/auth" element={<UNIHomeAuthPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/listings" element={
              <ProtectedRoute>
                <ListingsPage />
              </ProtectedRoute>
            } />
            <Route path="/publish" element={
              <ProtectedRoute>
                <PublishPage />
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
        
        {/* CSS per animazioni */}
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          
          * {
            box-sizing: border-box;
          }
          
          body {
            margin: 0;
            padding: 0;
            overflow-x: hidden;
          }
          
          input::placeholder,
          textarea::placeholder {
            color: rgba(255, 255, 255, 0.6);
          }
          
          .card-hover:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
          }        
        `}</style>
      </div>
    </AuthProvider>
  );
}
