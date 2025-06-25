// UNI Home - Design Moderno e Accattivante
import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, useLocation } from "react-router-dom";
import UNIHomeAuthPage from './pages/UNIHomeAuthPage-Fixed.jsx';
import CreateAnnouncementModern from './components/CreateAnnouncementModern.jsx';
import AnnouncementDetail from './components/AnnouncementDetail-Fixed.jsx';

// Context per gestire l'autenticazione
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

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Tema moderno con colori vibranti e accattivanti
const theme = {
  colors: {
    // Gradiente principale arcobaleno
    primary: '#667eea',
    primaryDark: '#5a67d8',
    secondary: '#f093fb',
    accent: '#4facfe',
    
    // Colori vivaci
    success: '#48bb78',
    warning: '#ed8936',
    error: '#f56565',
    info: '#4299e1',
    
    // Backgrounds con gradienti spettacolari
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    backgroundAlt: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #a8edea 100%)',
    backgroundCard: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    backgroundHero: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 50%, #a8edea 100%)',
    backgroundPurple: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backgroundPink: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    backgroundBlue: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    backgroundOrange: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    
    // Superfici moderne con glassmorphism
    surface: 'rgba(255, 255, 255, 0.98)',
    surfaceGlass: 'rgba(255, 255, 255, 0.15)',
    surfaceDark: 'rgba(0, 0, 0, 0.8)',
    surfaceBlur: 'rgba(255, 255, 255, 0.25)',
    
    // Testi
    text: '#1a1a1a',
    textLight: '#6b7280',
    textOnDark: '#ffffff',
    white: '#ffffff'
  },
  
  shadows: {
    sm: '0 2px 4px rgba(0, 0, 0, 0.1)',
    md: '0 4px 12px rgba(0, 0, 0, 0.15)',
    lg: '0 8px 25px rgba(0, 0, 0, 0.15)',
    xl: '0 20px 40px rgba(0, 0, 0, 0.2)',
    glow: '0 0 40px rgba(102, 126, 234, 0.4)',
    colorful: '0 8px 32px rgba(240, 147, 251, 0.4)',
    rainbow: '0 8px 32px rgba(102, 126, 234, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
    neon: '0 0 20px rgba(240, 147, 251, 0.6), 0 0 40px rgba(102, 126, 234, 0.4)'
  },
  
  transitions: {
    fast: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    normal: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    slow: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    elastic: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  },
  
  borderRadius: {
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    full: '50px'
  }
};

// Stili moderni e accattivanti
const styles = {
  // Layout principale
  container: {
    minHeight: '100vh',
    background: theme.colors.background,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif',
    color: theme.colors.textOnDark,
    position: 'relative',
    overflow: 'hidden'
  },
    // Sfondo animato con particelle
  backgroundPattern: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `
      radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.4) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(240, 147, 251, 0.4) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(168, 237, 234, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 90% 70%, rgba(255, 154, 158, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 10% 90%, rgba(254, 207, 239, 0.3) 0%, transparent 50%)
    `,
    zIndex: -1,
    animation: 'backgroundMove 30s ease-in-out infinite'
  },
    // Navbar glassmorphism avanzato
  navbar: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px) saturate(150%)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '20px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    transition: theme.transitions.normal,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
  },
  
  // Logo con effetti
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    cursor: 'pointer',
    transition: theme.transitions.bounce
  },
    logoIcon: {
    width: '48px',
    height: '48px',
    background: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 50%, #a8edea 100%)',
    borderRadius: theme.borderRadius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    boxShadow: theme.shadows.neon,
    transition: theme.transitions.elastic,
    border: '2px solid rgba(255, 255, 255, 0.3)',
    position: 'relative'
  },
  
  logoText: {
    fontSize: '28px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #ffffff 0%, #ffd6e8 50%, #a8edea 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '-0.5px',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  },
    // Pulsanti ultra moderni
  button: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: theme.colors.white,
    border: 'none',
    padding: '14px 28px',
    borderRadius: theme.borderRadius.full,
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: theme.transitions.elastic,
    boxShadow: theme.shadows.rainbow,
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    position: 'relative',
    overflow: 'hidden',
    textTransform: 'none',
    letterSpacing: '0.3px',
    transform: 'perspective(1px) translateZ(0)',
    backfaceVisibility: 'hidden'
  },
  
  buttonPrimary: {
    background: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 50%, #ffecd2 100%)',
    boxShadow: theme.shadows.neon,
    border: '2px solid rgba(255, 255, 255, 0.3)',
    color: '#333'
  },
  
  buttonSecondary: {
    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 50%, #ffecd2 100%)',
    color: theme.colors.text,
    boxShadow: theme.shadows.lg
  },
  
  buttonOutline: {
    background: 'rgba(255, 255, 255, 0.1)',
    color: theme.colors.white,
    border: '2px solid rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(10px)',
    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2)'
  },
    // Cards ultra moderne con effetti speciali
  card: {
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(20px)',
    borderRadius: theme.borderRadius.lg,
    padding: '32px',
    boxShadow: theme.shadows.rainbow,
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: theme.transitions.elastic,
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    transform: 'perspective(1px) translateZ(0)'
  },
  
  cardHover: {
    transform: 'translateY(-12px) scale(1.03) perspective(1px) translateZ(0)',
    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3), 0 0 50px rgba(240, 147, 251, 0.3)',
    background: 'rgba(255, 255, 255, 0.25)',
    borderColor: 'rgba(255, 255, 255, 0.4)'
  },
  
  // Layout pagine
  pageContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '60px 32px',
    position: 'relative',
    zIndex: 1
  },
  
  pageTitle: {
    fontSize: '48px',
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: '16px',
    background: 'linear-gradient(135deg, #ffffff 0%, #ffd6e8 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '-1px',
    lineHeight: '1.1'
  },
  
  pageSubtitle: {
    fontSize: '20px',
    textAlign: 'center',
    marginBottom: '48px',
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '400',
    lineHeight: '1.6'
  },
  
  // Griglia responsive
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '32px',
    marginTop: '48px'
  },
  
  // Form moderni
  form: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    borderRadius: theme.borderRadius.lg,
    padding: '40px',
    boxShadow: theme.shadows.xl,
    border: '1px solid rgba(255, 255, 255, 0.2)',
    maxWidth: '500px',
    margin: '0 auto'
  },
  
  input: {
    width: '100%',
    padding: '16px 20px',
    borderRadius: theme.borderRadius.md,
    border: '2px solid rgba(255, 255, 255, 0.2)',
    background: 'rgba(255, 255, 255, 0.9)',
    fontSize: '16px',
    color: theme.colors.text,
    transition: theme.transitions.fast,
    outline: 'none',
    marginBottom: '20px'
  },
  
  // Listing cards
  listingCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    boxShadow: theme.shadows.lg,
    transition: theme.transitions.normal,
    border: '1px solid rgba(255, 255, 255, 0.3)',
    color: theme.colors.text
  },
  
  listingImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
  },
  
  listingContent: {
    padding: '24px'
  },
  
  priceTag: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: theme.colors.white,
    padding: '8px 16px',
    borderRadius: theme.borderRadius.full,
    fontSize: '18px',
    fontWeight: '700',
    display: 'inline-block',
    marginBottom: '12px',
    boxShadow: theme.shadows.md
  },
    // Animazioni CSS potenziate
  animations: `
    @keyframes backgroundMove {
      0%, 100% { 
        transform: translateY(0px) rotate(0deg) scale(1); 
        filter: hue-rotate(0deg);
      }
      25% { 
        transform: translateY(-15px) rotate(0.5deg) scale(1.02); 
        filter: hue-rotate(10deg);
      }
      50% { 
        transform: translateY(-25px) rotate(1deg) scale(1.05); 
        filter: hue-rotate(20deg);
      }
      75% { 
        transform: translateY(-15px) rotate(0.5deg) scale(1.02); 
        filter: hue-rotate(10deg);
      }
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      25% { transform: translateY(-5px) rotate(1deg); }
      50% { transform: translateY(-10px) rotate(0deg); }
      75% { transform: translateY(-5px) rotate(-1deg); }
    }
    
    @keyframes pulse {
      0%, 100% { 
        transform: scale(1); 
        box-shadow: 0 0 20px rgba(240, 147, 251, 0.4);
      }
      50% { 
        transform: scale(1.05); 
        box-shadow: 0 0 40px rgba(240, 147, 251, 0.8);
      }
    }
    
    @keyframes rainbow {
      0% { filter: hue-rotate(0deg); }
      100% { filter: hue-rotate(360deg); }
    }
    
    @keyframes glow {
      0%, 100% { 
        text-shadow: 0 0 5px rgba(255, 255, 255, 0.8),
                     0 0 10px rgba(255, 255, 255, 0.8),
                     0 0 15px rgba(255, 255, 255, 0.8);
      }
      50% { 
        text-shadow: 0 0 10px rgba(255, 255, 255, 1),
                     0 0 20px rgba(255, 255, 255, 1),
                     0 0 30px rgba(255, 255, 255, 1);
      }
    }
  `
};

// Homepage moderna
const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.pageContent}>
      <div style={styles.backgroundPattern}></div>
      
      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <h1 style={styles.pageTitle}>
          🏠 Trova la Tua Casa Perfetta
        </h1>
        <p style={styles.pageSubtitle}>
          La piattaforma moderna per studenti universitari. 
          Connettiti, scopri e trova l'alloggio dei tuoi sogni.
        </p>
        
        <div style={{ 
          display: 'flex', 
          gap: '24px', 
          justifyContent: 'center', 
          flexWrap: 'wrap',
          marginTop: '40px'
        }}>
          <button
            style={{
              ...styles.button,
              ...styles.buttonPrimary,
              padding: '18px 36px',
              fontSize: '18px',
              fontWeight: '700'
            }}
            onClick={() => navigate('/auth')}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-3px) scale(1.05)';
              e.target.style.boxShadow = '0 15px 35px rgba(255, 154, 158, 0.6)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = styles.shadows.colorful;
            }}
          >
            🚀 Inizia Subito
          </button>
          <button
            style={{
              ...styles.button,
              ...styles.buttonOutline,
              padding: '16px 34px',
              fontSize: '18px'
            }}
            onClick={() => navigate('/listings')}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              e.target.style.transform = 'translateY(-3px)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            🔍 Esplora Case
          </button>
        </div>
      </div>
      
      <div style={styles.grid}>
        <div 
          style={styles.card}
          onMouseOver={(e) => {
            Object.assign(e.currentTarget.style, styles.cardHover);
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.boxShadow = styles.shadows.xl;
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔍</div>
          <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: theme.colors.white }}>
            Ricerca Intelligente
          </h3>
          <p style={{ fontSize: '16px', lineHeight: '1.6', color: 'rgba(255, 255, 255, 0.9)' }}>
            Trova la casa perfetta con filtri avanzati e geolocalizzazione. 
            Scopri la distanza dalle università.
          </p>
        </div>
        
        <div 
          style={styles.card}
          onMouseOver={(e) => {
            Object.assign(e.currentTarget.style, styles.cardHover);
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.boxShadow = styles.shadows.xl;
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>💬</div>
          <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: theme.colors.white }}>
            Chat Integrata
          </h3>
          <p style={{ fontSize: '16px', lineHeight: '1.6', color: 'rgba(255, 255, 255, 0.9)' }}>
            Connettiti direttamente con proprietari e coinquilini. 
            Comunicazione sicura e veloce.
          </p>
        </div>
        
        <div 
          style={styles.card}
          onMouseOver={(e) => {
            Object.assign(e.currentTarget.style, styles.cardHover);
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.boxShadow = styles.shadows.xl;
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🛡️</div>
          <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: theme.colors.white }}>
            Sicurezza Totale
          </h3>
          <p style={{ fontSize: '16px', lineHeight: '1.6', color: 'rgba(255, 255, 255, 0.9)' }}>
            Profili verificati e annunci controllati. 
            La tua sicurezza è la nostra priorità.
          </p>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: styles.animations }} />
    </div>
  );
};

// Dashboard moderna
const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={styles.pageContent}>
      <div style={styles.backgroundPattern}></div>
      
      <h1 style={styles.pageTitle}>
        👋 Benvenuto, {user?.nome || 'Studente'}!
      </h1>
      
      <p style={styles.pageSubtitle}>
        La tua dashboard personale per gestire alloggi e connessioni
      </p>
      
      <div style={styles.grid}>
        <div 
          style={{
            ...styles.card,
            background: 'linear-gradient(135deg, rgba(255, 154, 158, 0.2) 0%, rgba(254, 207, 239, 0.2) 100%)',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/listings')}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 154, 158, 0.3) 0%, rgba(254, 207, 239, 0.3) 100%)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 154, 158, 0.2) 0%, rgba(254, 207, 239, 0.2) 100%)';
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔍</div>
          <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: theme.colors.white }}>
            Cerca Case
          </h3>
          <p style={{ marginBottom: '24px', color: 'rgba(255, 255, 255, 0.9)' }}>
            Trova il tuo alloggio ideale
          </p>
          <button style={{
            ...styles.button,
            ...styles.buttonPrimary
          }}>
            Inizia Ricerca
          </button>
        </div>
        
        <div 
          style={{
            ...styles.card,
            background: 'linear-gradient(135deg, rgba(168, 237, 234, 0.2) 0%, rgba(254, 214, 227, 0.2) 100%)',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/publish')}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(168, 237, 234, 0.3) 0%, rgba(254, 214, 227, 0.3) 100%)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(168, 237, 234, 0.2) 0%, rgba(254, 214, 227, 0.2) 100%)';
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>📝</div>
          <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: theme.colors.white }}>
            Pubblica Annuncio
          </h3>
          <p style={{ marginBottom: '24px', color: 'rgba(255, 255, 255, 0.9)' }}>
            Condividi la tua casa
          </p>
          <button style={{
            ...styles.button,
            ...styles.buttonSecondary
          }}>
            Crea Annuncio
          </button>
        </div>
        
        <div 
          style={{
            ...styles.card,
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/messages')}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)';
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>💬</div>
          <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: theme.colors.white }}>
            I Tuoi Messaggi
          </h3>
          <p style={{ marginBottom: '24px', color: 'rgba(255, 255, 255, 0.9)' }}>
            Gestisci le conversazioni
          </p>
          <button style={{
            ...styles.button,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}>
            Apri Chat
          </button>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: styles.animations }} />
    </div>
  );
};

// Pagina listings moderna
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
        console.log('Dati ricevuti:', data);
        const announcementsArray = data.announcements || data || [];
        setListings(Array.isArray(announcementsArray) ? announcementsArray : []);
      } else {
        setError('Errore nel caricamento degli annunci');
      }
    } catch (error) {
      console.error('Errore fetch:', error);
      setError('Errore di connessione al server');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (listingId) => {
    console.log('Navigating to listing:', listingId);
    navigate(`/announcement/${listingId}`);
  };

  if (loading) {
    return (
      <div style={styles.pageContent}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '300px',
          fontSize: '48px'
        }}>
          <div style={{ animation: 'pulse 2s infinite' }}>🏠</div>
        </div>
        <p style={{ textAlign: 'center', fontSize: '18px' }}>
          Caricamento annunci...
        </p>
        <style dangerouslySetInnerHTML={{ __html: styles.animations }} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.pageContent}>
        <div style={{
          ...styles.card,
          textAlign: 'center',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '2px solid rgba(239, 68, 68, 0.3)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
          <h3 style={{ color: '#ff6b6b', marginBottom: '16px' }}>Errore</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{error}</p>
          <button 
            style={{
              ...styles.button,
              marginTop: '20px',
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)'
            }}
            onClick={fetchListings}
          >
            🔄 Riprova
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageContent}>
      <div style={styles.backgroundPattern}></div>
      
      <h1 style={styles.pageTitle}>
        🏠 Case Disponibili
      </h1>
      
      <p style={styles.pageSubtitle}>
        Scopri gli alloggi perfetti per la tua vita universitaria
      </p>

      {listings.length === 0 ? (
        <div style={{
          ...styles.card,
          textAlign: 'center',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🏡</div>
          <h3 style={{ marginBottom: '16px', color: theme.colors.white }}>
            Nessun annuncio disponibile
          </h3>
          <p style={{ marginBottom: '24px', color: 'rgba(255, 255, 255, 0.9)' }}>
            Sii il primo a pubblicare il tuo annuncio!
          </p>
          <button 
            style={{
              ...styles.button,
              ...styles.buttonPrimary
            }}
            onClick={() => navigate('/publish')}
          >
            📝 Pubblica Annuncio
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {listings.map((listing) => (
            <div
              key={listing.id}
              style={styles.listingCard}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-12px) scale(1.03)';
                e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.25)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = styles.shadows.lg;
              }}
            >
              <div style={styles.listingImage}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px',
                  background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
                }}>
                  🏠
                </div>
              </div>
              
              <div style={styles.listingContent}>
                <div style={styles.priceTag}>
                  €{listing.prezzo}/mese
                </div>
                
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  marginBottom: '12px',
                  color: theme.colors.text
                }}>
                  {listing.titolo}
                </h3>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '16px',
                  color: theme.colors.textLight
                }}>
                  <span>📍</span>
                  <span>{listing.citta}, {listing.indirizzo}</span>
                </div>
                
                <p style={{
                  color: theme.colors.textLight,
                  marginBottom: '20px',
                  lineHeight: '1.5'
                }}>
                  {listing.descrizione?.substring(0, 100)}...
                </p>
                
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  marginBottom: '20px'
                }}>
                  <span style={{
                    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                    color: theme.colors.text,
                    padding: '6px 12px',
                    borderRadius: theme.borderRadius.full,
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    🛏️ {listing.tipo_alloggio}
                  </span>
                  <span style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: theme.colors.white,
                    padding: '6px 12px',
                    borderRadius: theme.borderRadius.full,
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    👥 {listing.posti_letto} posti
                  </span>
                </div>
                
                <button
                  style={{
                    ...styles.button,
                    ...styles.buttonPrimary,
                    width: '100%',
                    justifyContent: 'center'
                  }}
                  onClick={() => handleViewDetails(listing.id)}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 12px 25px rgba(255, 154, 158, 0.5)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = styles.shadows.colorful;
                  }}
                >
                  🔍 Vedi Dettagli
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{ __html: styles.animations }} />
    </div>
  );
};

// Navbar moderna
const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav style={styles.navbar}>
      <div 
        style={styles.logo}
        onClick={() => navigate('/')}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <div style={styles.logoIcon}>🏠</div>
        <span style={styles.logoText}>UNI Home</span>
      </div>

      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        {isAuthenticated ? (
          <>
            <button
              style={styles.button}
              onClick={() => navigate('/dashboard')}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.background = 'linear-gradient(135deg, #5a67d8 0%, #667eea 100%)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
              }}
            >
              🏠 Dashboard
            </button>
            <button
              style={styles.button}
              onClick={() => navigate('/listings')}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.background = 'linear-gradient(135deg, #5a67d8 0%, #667eea 100%)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
              }}
            >
              🔍 Cerca
            </button>
            <button
              style={styles.button}
              onClick={() => navigate('/publish')}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.background = 'linear-gradient(135deg, #5a67d8 0%, #667eea 100%)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
              }}
            >
              📝 Pubblica
            </button>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '8px 16px',
              borderRadius: theme.borderRadius.full,
              color: theme.colors.white,
              fontSize: '14px',
              fontWeight: '600'
            }}>
              👋 {user?.nome || 'Utente'}
            </div>
            <button
              style={{
                ...styles.button,
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)'
              }}
              onClick={logout}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.background = 'linear-gradient(135deg, #ee5a24 0%, #ff6b6b 100%)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)';
              }}
            >
              🚪 Esci
            </button>
          </>
        ) : (
          <>
            <button
              style={styles.button}
              onClick={() => navigate('/listings')}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.background = 'linear-gradient(135deg, #5a67d8 0%, #667eea 100%)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
              }}
            >
              🔍 Esplora
            </button>
            <button
              style={{
                ...styles.button,
                ...styles.buttonPrimary
              }}
              onClick={() => navigate('/auth')}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 25px rgba(255, 154, 158, 0.6)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = styles.shadows.colorful;
              }}
            >
              🚀 Accedi
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

// Componente principale
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div style={styles.container}>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<UNIHomeAuthPage />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="/listings" element={<ListingsPage />} />
              <Route 
                path="/publish" 
                element={
                  <ProtectedRoute>
                    <CreateAnnouncementModern />
                  </ProtectedRoute>
                } 
              />
              <Route path="/announcement/:id" element={<AnnouncementDetail />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

// Componente per proteggere le rotte
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
        fontSize: '48px'
      }}>
        <div style={{ animation: 'pulse 2s infinite' }}>🏠</div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

export default App;
