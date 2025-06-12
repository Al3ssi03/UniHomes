import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function SimpleListingsPage() {
  const [status, setStatus] = useState("Inizializzazione...");
  const [backendStatus, setBackendStatus] = useState("Verifica in corso...");

  useEffect(() => {
    console.log("🏠 AlloggiFinder HomePage caricata");
    setStatus("✅ Frontend attivo");

    // Test connessione backend
    fetch("http://localhost:5000/api/announcements")
      .then(response => {
        if (response.ok) {
          setBackendStatus("✅ Backend connesso");
        } else {
          setBackendStatus("⚠️ Backend risponde ma con errori");
        }
      })
      .catch(error => {
        console.log("Backend non raggiungibile:", error);
        setBackendStatus("❌ Backend non raggiungibile");
      });
  }, []);

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px'
  };

  const buttonStyle = {
    padding: '12px 24px',
    margin: '8px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    textDecoration: 'none',
    display: 'inline-block',
    transition: 'all 0.3s ease'
  };

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{...cardStyle, textAlign: 'center', marginBottom: '30px'}}>
        <h1 style={{ 
          fontSize: '3rem', 
          color: '#333', 
          marginBottom: '10px',
          fontWeight: 'bold'
        }}>
          🏠 AlloggiFinder
        </h1>
        <p style={{ 
          fontSize: '1.2rem', 
          color: '#666',
          marginBottom: '20px'
        }}>
          Trova il tuo alloggio perfetto per studio e lavoro
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <span style={{ padding: '8px 16px', backgroundColor: '#e8f5e8', color: '#2d6a2d', borderRadius: '20px' }}>
            {status}
          </span>
          <span style={{ 
            padding: '8px 16px', 
            backgroundColor: backendStatus.includes('✅') ? '#e8f5e8' : '#ffeaa7', 
            color: backendStatus.includes('✅') ? '#2d6a2d' : '#8b4513', 
            borderRadius: '20px' 
          }}>
            {backendStatus}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div style={cardStyle}>
        <h2 style={{ color: '#333', marginBottom: '20px' }}>🚀 Inizia subito</h2>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <Link 
            to="/listings" 
            style={{
              ...buttonStyle,
              backgroundColor: '#4CAF50',
              color: 'white'
            }}
          >
            📋 Vedi tutti gli annunci
          </Link>
          <Link 
            to="/auth" 
            style={{
              ...buttonStyle,
              backgroundColor: '#2196F3',
              color: 'white'
            }}
          >
            🔐 Accedi / Registrati
          </Link>
          <Link 
            to="/crea" 
            style={{
              ...buttonStyle,
              backgroundColor: '#FF9800',
              color: 'white'
            }}
          >
            ➕ Crea annuncio
          </Link>
        </div>
      </div>

      {/* Features */}
      <div style={cardStyle}>
        <h2 style={{ color: '#333', marginBottom: '20px' }}>✨ Caratteristiche</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🔍</div>
            <h3 style={{ color: '#333', marginBottom: '10px' }}>Ricerca avanzata</h3>
            <p style={{ color: '#666' }}>Trova l'alloggio perfetto con filtri dettagliati</p>
          </div>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>💬</div>
            <h3 style={{ color: '#333', marginBottom: '10px' }}>Chat integrata</h3>
            <p style={{ color: '#666' }}>Comunica direttamente con i proprietari</p>
          </div>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📱</div>
            <h3 style={{ color: '#333', marginBottom: '10px' }}>Mobile friendly</h3>
            <p style={{ color: '#666' }}>Accedi da qualsiasi dispositivo</p>
          </div>
        </div>
      </div>

      {/* Debug Info */}
      <div style={{...cardStyle, backgroundColor: '#f8f9fa'}}>
        <h3 style={{ color: '#333', marginBottom: '15px' }}>🔧 Informazioni tecniche</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div>
            <strong>Frontend:</strong> React 18 + Vite
          </div>
          <div>
            <strong>Backend:</strong> Node.js + Express
          </div>
          <div>
            <strong>Database:</strong> SQLite
          </div>
          <div>
            <strong>Ora:</strong> {new Date().toLocaleTimeString()}
          </div>
        </div>
        <div style={{ marginTop: '15px' }}>
          <Link 
            to="/test" 
            style={{
              ...buttonStyle,
              backgroundColor: '#6c757d',
              color: 'white',
              fontSize: '14px'
            }}
          >
            🧪 Pagina di test
          </Link>
        </div>
      </div>
    </div>
  );
}
