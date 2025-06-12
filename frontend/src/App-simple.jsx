// Super simple App
import React from 'react';

export default function App() {
  console.log("🎯 App rendering");
  
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      color: 'white'
    },
    card: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      padding: '30px',
      borderRadius: '15px',
      maxWidth: '600px',
      margin: '50px auto',
      textAlign: 'center',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
    },
    title: {
      fontSize: '3em',
      marginBottom: '20px',
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
    },
    success: {
      background: 'rgba(40, 167, 69, 0.8)',
      padding: '15px',
      borderRadius: '8px',
      margin: '20px 0',
      fontSize: '1.2em',
      fontWeight: 'bold'
    },
    button: {
      background: 'rgba(255, 193, 7, 0.9)',
      color: '#000',
      padding: '12px 25px',
      border: 'none',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      margin: '10px',
      transition: 'all 0.3s ease'
    }
  };

  const handleClick = () => {
    alert('🎉 React App Funziona!\n\nAdesso il problema della schermata bianca è risolto.');
    console.log("Button clicked - React is working!");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🏠 AlloggiFinder</h1>
        
        <div style={styles.success}>
          ✅ SUCCESSO! React App Funziona!
        </div>
        
        <p>Se vedi questa pagina, significa che:</p>
        <ul style={{ textAlign: 'left', margin: '20px 0' }}>
          <li>✅ Il server frontend è attivo</li>
          <li>✅ React si sta caricando correttamente</li>
          <li>✅ La schermata bianca è stata risolta</li>
        </ul>
        
        <button style={styles.button} onClick={handleClick}>
          🧪 Test Click
        </button>
        
        <div style={{ marginTop: '30px', fontSize: '0.9em', opacity: '0.8' }}>
          <p>Timestamp: {new Date().toLocaleString()}</p>
          <p>React Version: {React.version}</p>
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <p>🔗 Prossimi passi:</p>
          <ul style={{ textAlign: 'left' }}>
            <li>Vai su <strong>/test</strong> per test avanzati</li>
            <li>Vai su <strong>/auth</strong> per il login</li>
            <li>Backend API: <strong>localhost:5000</strong></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
