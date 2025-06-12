// UNI Home - App moderna con design fluido e rebranding completo
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import UNIHomeAuthPage from './pages/UNIHomeAuthPage.jsx';

// Design System per UNI Home
const theme = {
  colors: {
    primary: '#6366f1', // Indigo moderno
    primaryDark: '#4f46e5',
    secondary: '#06b6d4', // Cyan
    secondaryDark: '#0891b2',
    accent: '#f59e0b', // Amber
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

// Componenti di stile moderni
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
  button: {
    background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
    color: theme.colors.white,
    border: 'none',
    padding: '12px 24px',
    borderRadius: theme.borderRadius.md,
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: theme.transitions.fast,
    boxShadow: theme.shadows.md,
    position: 'relative',
    overflow: 'hidden'
  },
  buttonOutline: {
    background: 'transparent',
    color: theme.colors.white,
    border: `2px solid ${theme.colors.surfaceGlass}`,
    padding: '10px 22px',
    borderRadius: theme.borderRadius.md,
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: theme.transitions.fast,
    backdropFilter: 'blur(10px)'
  },
  heroSection: {
    textAlign: 'center',
    padding: '120px 20px 80px 20px',
    position: 'relative'
  },
  heroTitle: {
    fontSize: 'clamp(3rem, 8vw, 5rem)',
    fontWeight: '900',
    marginBottom: '24px',
    background: `linear-gradient(135deg, ${theme.colors.white}, ${theme.colors.secondary})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textShadow: '0 4px 20px rgba(0,0,0,0.3)',
    lineHeight: '1.1'
  },
  heroSubtitle: {
    fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
    marginBottom: '48px',
    opacity: 0.95,
    maxWidth: '700px',
    margin: '0 auto 48px auto',
    lineHeight: '1.6',
    fontWeight: '400'
  },
  buttonGroup: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '60px'
  },
  buttonPrimary: {
    background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
    color: theme.colors.white,
    border: 'none',
    padding: '18px 36px',
    borderRadius: theme.borderRadius.lg,
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: theme.transitions.fast,
    boxShadow: theme.shadows.xl,
    position: 'relative',
    overflow: 'hidden'
  },
  buttonSecondaryLarge: {
    background: 'transparent',
    color: theme.colors.white,
    border: `2px solid ${theme.colors.white}`,
    padding: '16px 34px',
    borderRadius: theme.borderRadius.lg,
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: theme.transitions.fast,
    backdropFilter: 'blur(10px)'
  },
  featuresSection: {
    padding: '80px 20px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  sectionTitle: {
    fontSize: 'clamp(2rem, 5vw, 3rem)',
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: '60px',
    background: `linear-gradient(135deg, ${theme.colors.white}, ${theme.colors.secondary})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '32px'
  },
  featureCard: {
    background: theme.colors.surface,
    padding: '40px 32px',
    borderRadius: theme.borderRadius.xl,
    boxShadow: theme.shadows.xl,
    textAlign: 'center',
    transition: theme.transitions.normal,
    border: '1px solid rgba(255, 255, 255, 0.1)',
    position: 'relative',
    overflow: 'hidden'
  },
  featureIcon: {
    width: '80px',
    height: '80px',
    background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
    borderRadius: theme.borderRadius.full,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    margin: '0 auto 24px auto',
    boxShadow: theme.shadows.glow
  },
  featureTitle: {
    fontSize: '20px',
    fontWeight: '700',
    marginBottom: '16px',
    color: theme.colors.text
  },
  featureDescription: {
    color: theme.colors.textLight,
    lineHeight: '1.6',
    fontSize: '16px'
  }
};

// Logo componente SVG moderno per UNI Home
function UNIHomeLogo({ size = 40, className = "" }) {
  return (
    <div 
      style={{
        ...styles.logoIcon,
        width: size,
        height: size
      }}
      className={className}
    >
      <svg 
        width={size * 0.6} 
        height={size * 0.6} 
        viewBox="0 0 24 24" 
        fill="none"
      >
        <path 
          d="M3 21L12 12L21 21H3Z" 
          fill="currentColor" 
          opacity="0.8"
        />
        <path 
          d="M12 3L3 12H21L12 3Z" 
          fill="currentColor"
        />
        <circle 
          cx="12" 
          cy="15" 
          r="2" 
          fill="rgba(255,255,255,0.9)"
        />
      </svg>
    </div>
  );
}

// Navbar moderna
function ModernNavbar() {
  const navigate = useNavigate();
  
  const handleHover = (e, isEntering) => {
    if (isEntering) {
      e.target.style.transform = 'translateY(-2px) scale(1.02)';
      e.target.style.boxShadow = theme.shadows.xl;
    } else {
      e.target.style.transform = 'translateY(0) scale(1)';
      e.target.style.boxShadow = theme.shadows.md;
    }
  };
  
  const handleLogoHover = (e, isEntering) => {
    if (isEntering) {
      e.currentTarget.style.transform = 'scale(1.05)';
    } else {
      e.currentTarget.style.transform = 'scale(1)';
    }
  };
  
  return (
    <nav style={styles.navbar}>
      <div 
        style={styles.logo} 
        onClick={() => navigate('/')}
        onMouseEnter={(e) => handleLogoHover(e, true)}
        onMouseLeave={(e) => handleLogoHover(e, false)}
      >
        <UNIHomeLogo size={40} />
        <span style={styles.logoText}>UNI Home</span>
      </div>
      <div style={styles.navButtons}>
        <button 
          style={styles.buttonOutline}
          onClick={() => navigate('/')}
          onMouseEnter={(e) => {
            e.target.style.background = theme.colors.surfaceGlass;
            e.target.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          🏠 Home
        </button>
        <button 
          style={styles.button}
          onClick={() => navigate('/auth')}
          onMouseEnter={(e) => handleHover(e, true)}
          onMouseLeave={(e) => handleHover(e, false)}
        >
          🔐 Accedi
        </button>
      </div>
    </nav>
  );
}

// Homepage moderna
function ModernHomepage() {
  const navigate = useNavigate();
  
  const handleButtonHover = (e, isEntering) => {
    if (isEntering) {
      e.target.style.transform = 'translateY(-3px) scale(1.02)';
      e.target.style.boxShadow = theme.shadows.xl;
    } else {
      e.target.style.transform = 'translateY(0) scale(1)';
      e.target.style.boxShadow = theme.shadows.lg;
    }
  };
  
  const handleCardHover = (e, isEntering) => {
    if (isEntering) {
      e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
      e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
    } else {
      e.currentTarget.style.transform = 'translateY(0) scale(1)';
      e.currentTarget.style.boxShadow = theme.shadows.xl;
    }
  };
  
  const features = [
    {
      icon: '🔐',
      title: 'Autenticazione Sicura',
      description: 'Sistema di registrazione e login avanzato con crittografia e protezione JWT'
    },
    {
      icon: '🎯',
      title: 'Ricerca Intelligente',
      description: 'Filtri avanzati, geolocalizzazione e algoritmi di matching per trovare la casa perfetta'
    },
    {
      icon: '💬',
      title: 'Chat Integrata',
      description: 'Messaggistica in tempo reale per comunicare direttamente con proprietari e coinquilini'
    },
    {
      icon: '📊',
      title: 'Dashboard Personale',
      description: 'Gestisci i tuoi annunci, monitora le statistiche e controlla le prenotazioni'
    },
    {
      icon: '🗺️',
      title: 'Mappe Interattive',
      description: 'Visualizzazione su mappa con dettagli del quartiere, trasporti e servizi'
    },
    {
      icon: '⚡',
      title: 'Notifiche Smart',
      description: 'Avvisi personalizzati per nuovi annunci, messaggi e aggiornamenti importanti'
    }
  ];
  
  return (
    <div>
      {/* Hero Section */}
      <section style={styles.heroSection}>
        <h1 style={styles.heroTitle}>
          UNI Home
        </h1>
        <p style={styles.heroSubtitle}>
          La piattaforma più moderna per studenti universitari. 
          Trova la tua casa ideale, connettiti con coinquilini e gestisci tutto in un'unica app.
        </p>
        <div style={styles.buttonGroup}>
          <button
            style={styles.buttonPrimary}
            onClick={() => navigate('/auth')}
            onMouseEnter={(e) => handleButtonHover(e, true)}
            onMouseLeave={(e) => handleButtonHover(e, false)}
          >
            🚀 Inizia Subito
          </button>
          <button
            style={styles.buttonSecondaryLarge}
            onClick={() => navigate('/auth')}
            onMouseEnter={(e) => {
              e.target.style.background = theme.colors.white;
              e.target.style.color = theme.colors.primary;
              e.target.style.transform = 'translateY(-3px) scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = theme.colors.white;
              e.target.style.transform = 'translateY(0) scale(1)';
            }}
          >
            🔍 Esplora Case
          </button>
        </div>
        
        {/* Status Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: theme.colors.surfaceGlass,
          padding: '12px 20px',
          borderRadius: theme.borderRadius.full,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            background: theme.colors.success,
            borderRadius: '50%',
            animation: 'pulse 2s infinite'
          }}></div>
          <span style={{ fontSize: '14px', fontWeight: '500' }}>
            ✅ Sistema Attivo e Funzionante
          </span>
        </div>
      </section>
      
      {/* Features Section */}
      <section style={styles.featuresSection}>
        <h2 style={styles.sectionTitle}>
          ✨ Funzionalità Avanzate
        </h2>
        <div style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div 
              key={index} 
              style={styles.featureCard}
              onMouseEnter={(e) => handleCardHover(e, true)}
              onMouseLeave={(e) => handleCardHover(e, false)}
            >
              <div style={styles.featureIcon}>
                {feature.icon}
              </div>
              <h3 style={styles.featureTitle}>
                {feature.title}
              </h3>
              <p style={styles.featureDescription}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// App principale UNI Home
export default function UNIHomeApp() {
  console.log("🏠 UNI Home - App Moderna Avviata");
  
  return (
    <div style={styles.container}>
      <Router>
        <ModernNavbar />
        <Routes>
          <Route path="/" element={<ModernHomepage />} />
          <Route path="/auth" element={<UNIHomeAuthPage />} />
          <Route path="*" element={<ModernHomepage />} />
        </Routes>
      </Router>
      
      {/* CSS per animazioni */}
      <style>{`
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
      `}</style>
    </div>
  );
}
