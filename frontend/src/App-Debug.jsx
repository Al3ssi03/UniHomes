// Debug app per identificare il problema
import React from 'react';

console.log("🐛 DEBUG APP - Starting...");

// Test 1: Rendering semplice
function DebugTest1() {
  console.log("✅ DebugTest1 rendering");
  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        padding: '40px',
        borderRadius: '15px',
        color: '#333',
        textAlign: 'center',
        maxWidth: '500px'
      }}>
        <h1>🐛 Debug Mode</h1>
        <p>Se vedi questo messaggio, React funziona!</p>
        <div style={{
          background: '#10b981',
          color: 'white',
          padding: '10px',
          borderRadius: '8px',
          margin: '20px 0'
        }}>
          ✅ Rendering Basic: OK
        </div>
        <button 
          style={{
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
          onClick={() => console.log("Button clicked!")}
        >
          Test Interattività
        </button>
      </div>
    </div>
  );
}

// Test 2: Con Router
function DebugTest2() {
  console.log("✅ DebugTest2 with Router");
  try {
    const { BrowserRouter: Router, Routes, Route } = require("react-router-dom");
    console.log("✅ React Router imported successfully");
    
    return (
      <Router>
        <div style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'Arial, sans-serif'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.95)',
            padding: '40px',
            borderRadius: '15px',
            color: '#333',
            textAlign: 'center'
          }}>
            <h1>🔄 Router Test</h1>
            <p>Router caricato con successo!</p>
            <Routes>
              <Route path="*" element={
                <div style={{
                  background: '#10b981',
                  color: 'white',
                  padding: '10px',
                  borderRadius: '8px',
                  margin: '20px 0'
                }}>
                  ✅ Routing: OK
                </div>
              } />
            </Routes>
          </div>
        </div>
      </Router>
    );
  } catch (error) {
    console.error("❌ Router Error:", error);
    return (
      <div style={{
        background: '#ef4444',
        color: 'white',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h1>❌ Router Error</h1>
        <p>{error.message}</p>
      </div>
    );
  }
}

// App di debug principale
export default function DebugApp() {
  console.log("🐛 DebugApp rendering");
  
  const [testLevel, setTestLevel] = React.useState(1);
  
  React.useEffect(() => {
    console.log("🐛 DebugApp useEffect running");
    console.log("Current test level:", testLevel);
  }, [testLevel]);
  
  if (testLevel === 1) {
    return <DebugTest1 />;
  }
  
  return <DebugTest2 />;
}
