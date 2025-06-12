import React from "react";
import ReactDOM from "react-dom/client";

console.log("🚀 Backup App - Loading...");

// Simple working app without external dependencies
function BackupApp() {
    const [count, setCount] = React.useState(0);
    
    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Arial, sans-serif',
            color: 'white',
            padding: '20px'
        }}>
            <div style={{
                textAlign: 'center',
                background: 'rgba(255,255,255,0.1)',
                padding: '40px',
                borderRadius: '20px',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
            }}>
                <h1 style={{ 
                    fontSize: '3rem', 
                    marginBottom: '20px',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                }}>
                    🏠 AlloggiFinder
                </h1>
                <p style={{ fontSize: '1.5rem', marginBottom: '30px' }}>
                    App di ricerca alloggi
                </p>
                
                <div style={{ marginBottom: '30px' }}>
                    <button 
                        onClick={() => setCount(count + 1)}
                        style={{
                            background: 'rgba(255,255,255,0.2)',
                            border: '2px solid rgba(255,255,255,0.3)',
                            color: 'white',
                            padding: '15px 30px',
                            fontSize: '18px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
                        onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                    >
                        Clic: {count}
                    </button>
                </div>
                
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '15px',
                    marginTop: '30px'
                }}>
                    <div style={{ padding: '15px', background: 'rgba(40, 167, 69, 0.8)', borderRadius: '10px' }}>
                        ✅ React 18
                    </div>
                    <div style={{ padding: '15px', background: 'rgba(40, 167, 69, 0.8)', borderRadius: '10px' }}>
                        ✅ Vite
                    </div>
                    <div style={{ padding: '15px', background: 'rgba(40, 167, 69, 0.8)', borderRadius: '10px' }}>
                        ✅ Hot Reload
                    </div>
                </div>
                
                <p style={{ marginTop: '30px', opacity: 0.8 }}>
                    Server attivo su localhost:5176
                </p>
                <p style={{ opacity: 0.6, fontSize: '14px' }}>
                    {new Date().toLocaleString()}
                </p>
            </div>
        </div>
    );
}

const rootElement = document.getElementById("root");
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<BackupApp />);
    console.log("✅ Backup App rendered successfully");
} else {
    console.error("❌ Root element not found");
}
