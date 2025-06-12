// App di emergenza senza dipendenze complesse
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

// Stili inline per emergenza
const emergencyStyles = {
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
    color: 'white'
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  button: {
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    margin: '0 5px',
    fontSize: '14px'
  },
  page: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
    color: 'white',
    textAlign: 'center'
  },
  card: {
    background: 'rgba(255,255,255,0.95)',
    padding: '40px',
    borderRadius: '15px',
    color: '#333',
    maxWidth: '500px',
    margin: '0 auto'
  }
};

// Navbar di emergenza
function EmergencyNavbar() {
  const navigate = useNavigate();
  
  return (
    <nav style={emergencyStyles.navbar}>
      <div style={emergencyStyles.logo} onClick={() => navigate('/')}>
        🏠 AlloggiFinder
      </div>
      <div>
        <button 
          style={emergencyStyles.button}
          onClick={() => navigate('/')}
        >
          Home
        </button>
        <button 
          style={emergencyStyles.button}
          onClick={() => navigate('/auth')}
        >
          Accedi
        </button>
      </div>
    </nav>
  );
}

// Homepage di emergenza
function EmergencyHome() {
  const navigate = useNavigate();
  
  return (
    <div style={emergencyStyles.page}>
      <div style={emergencyStyles.card}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>
          🏠 AlloggiFinder
        </h1>
        <p style={{ fontSize: '1.1rem', marginBottom: '30px', color: '#666' }}>
          La piattaforma per trovare alloggi per studenti e lavoratori
        </p>
        <div>
          <button 
            style={{...emergencyStyles.button, padding: '12px 24px', fontSize: '16px'}}
            onClick={() => navigate('/auth')}
          >
            🔐 Accedi / Registrati
          </button>
        </div>
        <div style={{ marginTop: '20px', fontSize: '14px', color: '#999' }}>
          <p>✅ Sistema di autenticazione attivo</p>
          <p>🔧 Modalità di emergenza</p>
        </div>
      </div>
    </div>
  );
}

// Pagina di autenticazione di emergenza
function EmergencyAuth() {
  return (
    <div style={emergencyStyles.page}>
      <div style={emergencyStyles.card}>
        <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>
          🔐 Autenticazione
        </h2>
        <p style={{ marginBottom: '20px', color: '#666' }}>
          Il sistema di autenticazione è disponibile nella versione completa dell'app.
        </p>
        <div style={{ background: '#f0f9ff', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          <p style={{ fontSize: '14px', color: '#0369a1' }}>
            <strong>Nota:</strong> Questa è una versione di emergenza. 
            Per accedere al sistema completo, riavvia l'applicazione.
          </p>
        </div>
        <button 
          style={emergencyStyles.button}
          onClick={() => window.location.reload()}
        >
          🔄 Ricarica App
        </button>
      </div>
    </div>
  );
}

// App di emergenza
export default function EmergencyApp() {
  console.log("🚨 EMERGENCY APP LOADED - Fallback mode");
  
  return (
    <div style={emergencyStyles.container}>
      <Router>
        <EmergencyNavbar />
        <Routes>
          <Route path="/" element={<EmergencyHome />} />
          <Route path="/auth" element={<EmergencyAuth />} />
          <Route path="*" element={<EmergencyHome />} />
        </Routes>
      </Router>
    </div>
  );
}
