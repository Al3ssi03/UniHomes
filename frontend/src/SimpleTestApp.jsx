import React from 'react';

const SimpleTestApp = () => {
  console.log("SimpleTestApp rendering...");
  
  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '24px',
      fontWeight: 'bold'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '40px',
        borderRadius: '20px',
        textAlign: 'center'
      }}>
        <h1>🎨 UNI Home Test</h1>
        <p>App is working!</p>
      </div>
    </div>
  );
};

export default SimpleTestApp;
