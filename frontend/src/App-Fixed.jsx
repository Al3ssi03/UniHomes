// App con gestione errori migliorata e fallback CSS
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

// Import con try-catch per gestire errori
let EnhancedLoginRegisterPage;
try {
  EnhancedLoginRegisterPage = require('./pages/EnhancedLoginRegisterPage').default;
} catch (err) {
  console.error("Errore caricamento EnhancedLoginRegisterPage:", err);
  EnhancedLoginRegisterPage = () => <div>Errore caricamento pagina auth</div>;
}

// Stili inline completi per evitare dipendenze CSS
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: 'Arial, sans-serif'
  },
  navbar: {
    background: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
    padding: '15px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'white',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  navButtons: {
    display: 'flex',
    gap: '10px'
  },
  button: {
    background: 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'transform 0.2s',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
  },
  buttonSecondary: {
    background: 'linear-gradient(45deg, #10b981, #059669)',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'transform 0.2s',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
  },
  heroSection: {
    textAlign: 'center',
    padding: '80px 20px',
    color: 'white'
  },
  title: {
    fontSize: '4rem',
    fontWeight: 'bold',
    marginBottom: '20px',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
  },
  subtitle: {
    fontSize: '1.3rem',
    marginBottom: '40px',
    opacity: 0.9,
    maxWidth: '600px',
    margin: '0 auto 40px auto',
    lineHeight: '1.6'
  },
  buttonGroup: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  card: {
    background: 'rgba(255,255,255,0.95)',
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    margin: '20px',
    maxWidth: '500px',
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'center'
  }
};

// Navbar inline semplificata
function InlineNavbar() {
  const navigate = useNavigate();
  
  const handleMouseOver = (e) => {
    e.target.style.transform = 'translateY(-2px)';
  };
  
  const handleMouseOut = (e) => {
    e.target.style.transform = 'translateY(0)';
  };
  
  return (
    <nav style={styles.navbar}>
      <div style={styles.logo} onClick={() => navigate('/')}>
        <span>🏠</span>
        <span>AlloggiFinder</span>
      </div>
      <div style={styles.navButtons}>
        <button 
          style={styles.button}
          onClick={() => navigate('/')}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          🏠 Home
        </button>
        <button 
          style={styles.buttonSecondary}
          onClick={() => navigate('/auth')}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          🔐 Accedi
        </button>
      </div>
    </nav>
  );
}

// Homepage inline
function InlineHomepage() {
  const navigate = useNavigate();
  
  const handleButtonHover = (e) => {
    e.target.style.transform = 'translateY(-2px)';
  };
  
  const handleButtonLeave = (e) => {
    e.target.style.transform = 'translateY(0)';
  };
  
  return (
    <div>
      <section style={styles.heroSection}>
        <h1 style={styles.title}>🏠 AlloggiFinder</h1>
        <p style={styles.subtitle}>
          La piattaforma più avanzata per trovare alloggi per studenti e lavoratori. 
          Registrati ora e accedi a migliaia di opportunità!
        </p>
        <div style={styles.buttonGroup}>
          <button
            onClick={() => navigate('/auth')}
            style={{
              ...styles.button,
              padding: '15px 30px',
              fontSize: '16px'
            }}
            onMouseOver={handleButtonHover}
            onMouseOut={handleButtonLeave}
          >
            🚀 Inizia Ora
          </button>
          <button
            onClick={() => navigate('/auth')}
            style={{
              ...styles.buttonSecondary,
              padding: '15px 30px',
              fontSize: '16px'
            }}
            onMouseOver={handleButtonHover}
            onMouseOut={handleButtonLeave}
          >
            🔍 Cerca Alloggi
          </button>
        </div>
      </section>
      
      {/* Features Section */}
      <section style={{ padding: '60px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ 
            textAlign: 'center', 
            color: 'white', 
            fontSize: '2.5rem', 
            marginBottom: '40px' 
          }}>
            ✨ Funzionalità
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px'
          }}>
            {[
              {
                icon: '🔐',
                title: 'Autenticazione Sicura',
                description: 'Sistema di login e registrazione completo con JWT tokens'
              },
              {
                icon: '💬',
                title: 'Messaggistica',
                description: 'Chat integrata per comunicare con i proprietari'
              },
              {
                icon: '🗺️',
                title: 'Mappe Interattive',
                description: 'Visualizza gli alloggi su mappa per trovare la posizione perfetta'
              }
            ].map((feature, index) => (
              <div key={index} style={styles.card}>
                <div style={{ fontSize: '3rem', marginBottom: '15px' }}>
                  {feature.icon}
                </div>
                <h3 style={{ 
                  fontSize: '1.3rem', 
                  fontWeight: 'bold', 
                  marginBottom: '15px',
                  color: '#333'
                }}>
                  {feature.title}
                </h3>
                <p style={{ color: '#666', lineHeight: '1.6' }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// Pagina semplice per le route mancanti
function SimplePage({ title, emoji, description }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      padding: '20px'
    }}>
      <div style={styles.card}>
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>{emoji}</div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#333' }}>{title}</h1>
        <p style={{ fontSize: '1.1rem', color: '#666', lineHeight: '1.6' }}>{description}</p>
        <div style={{ marginTop: '30px', padding: '15px', background: '#f0f9ff', borderRadius: '8px' }}>
          <p style={{ fontSize: '14px', color: '#0369a1', margin: 0 }}>
            ✅ Sistema di autenticazione implementato e funzionante
          </p>
        </div>
      </div>
    </div>
  );
}

// App principale con gestione errori
export default function AppInlineFixed() {
  console.log("🚀 AlloggiFinder - App con stili inline migliorata");
  
  return (
    <div style={styles.container}>
      <Router>
        <InlineNavbar />
        <Routes>
          <Route path="/" element={<InlineHomepage />} />
          <Route path="/auth" element={<EnhancedLoginRegisterPage />} />
          <Route path="/crea" element={
            <SimplePage 
              title="Pubblica Annuncio" 
              emoji="📝" 
              description="Pubblica il tuo alloggio e raggiungi migliaia di potenziali inquilini."
            />
          } />
          <Route path="/dashboard" element={
            <SimplePage 
              title="Dashboard" 
              emoji="📊" 
              description="Monitora le performance dei tuoi annunci e gestisci la tua attività."
            />
          } />
          <Route path="/inbox" element={
            <SimplePage 
              title="Messaggi" 
              emoji="💬" 
              description="Gestisci tutte le tue conversazioni con potenziali inquilini."
            />
          } />
          <Route path="*" element={<InlineHomepage />} />
        </Routes>
      </Router>
    </div>
  );
}
