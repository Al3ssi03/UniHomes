// Minimal App for debugging
import React, { useEffect } from 'react';

export default function App() {
  console.log("🎯 App component rendering");
  
  useEffect(() => {
    console.log("🎯 App useEffect triggered");
    document.title = "AlloggiFinder Test";
    
    // Force show something on the page
    setTimeout(() => {
      console.log("🎯 Timeout executed - page should be visible");
    }, 1000);
  }, []);
  
  const handleClick = () => {
    console.log("Button clicked!");
    alert('Button works! React is functioning.');
  };
  
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#ff6b6b', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
      fontSize: '18px'
    }}>
      <h1 style={{ 
        color: 'white', 
        fontSize: '32px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
      }}>
        🏠 ALLOGGI FINDER - DEBUG MODE
      </h1>
      
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        margin: '20px 0',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
      }}>
        <p style={{ color: '#2ecc71', fontWeight: 'bold', fontSize: '20px' }}>
          ✅ SE VEDI QUESTO, REACT STA FUNZIONANDO!
        </p>
        <p style={{ color: '#333' }}>
          Timestamp: {new Date().toLocaleString()}
        </p>
        <p style={{ color: '#333' }}>
          Window size: {typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'Unknown'}
        </p>
      </div>
      
      <button 
        onClick={handleClick}
        style={{
          padding: '15px 30px',
          backgroundColor: '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '18px',
          fontWeight: 'bold',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
        }}
      >
        🧪 TEST CLICK
      </button>
      
      <div style={{
        marginTop: '20px',
        backgroundColor: '#f39c12',
        color: 'white',
        padding: '15px',
        borderRadius: '8px'
      }}>
        <h3>🔧 Debug Info:</h3>
        <ul>
          <li>React Version: {React.version || 'Unknown'}</li>
          <li>NODE_ENV: {process.env.NODE_ENV || 'Unknown'}</li>
          <li>Current URL: {typeof window !== 'undefined' ? window.location.href : 'Unknown'}</li>
        </ul>
      </div>
    </div>
  );
}
