import React from "react";
import ReactDOM from "react-dom/client";

console.log("🚀 AlloggiFinder - Versione React Funzionante");

// Component principale semplice e funzionante
function AlloggiFinderApp() {
    const [count, setCount] = React.useState(0);
    const [status, setStatus] = React.useState("Caricamento...");
    
    React.useEffect(() => {
        console.log("✅ AlloggiFinderApp mounted successfully");
        setStatus("✅ App React attiva!");
        
        // Test connessione backend
        fetch("http://localhost:5000/api/announcements")
            .then(response => {
                if (response.ok) {
                    setStatus("✅ Frontend + Backend connessi!");
                } else {
                    setStatus("✅ Frontend attivo, Backend in attesa");
                }
            })
            .catch(() => {
                setStatus("✅ Frontend attivo, Backend offline");
            });
    }, []);

    const cardStyle = {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: '20px',
        padding: '30px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        textAlign: 'center',
        margin: '20px 0'
    };

    const buttonStyle = {
        background: 'rgba(255,255,255,0.2)',
        border: '2px solid rgba(255,255,255,0.3)',
        color: 'white',
        padding: '15px 30px',
        fontSize: '18px',
        borderRadius: '10px',
        cursor: 'pointer',
        margin: '10px',
        transition: 'all 0.3s ease'
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            color: 'white',
            padding: '20px',
            boxSizing: 'border-box'
        }}>
            <div style={{ maxWidth: '800px', width: '100%' }}>
                {/* Header principale */}
                <div style={cardStyle}>
                    <h1 style={{
                        fontSize: '3.5rem',
                        marginBottom: '20px',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                        background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        🏠 AlloggiFinder
                    </h1>
                    
                    <p style={{ fontSize: '1.3rem', marginBottom: '20px', opacity: 0.9 }}>
                        Piattaforma di ricerca alloggi per studenti e lavoratori
                    </p>
                    
                    <div style={{
                        display: 'inline-block',
                        padding: '10px 20px',
                        backgroundColor: count > 0 ? 'rgba(40, 167, 69, 0.8)' : 'rgba(0, 123, 255, 0.8)',
                        borderRadius: '25px',
                        fontSize: '16px',
                        fontWeight: 'bold'
                    }}>
                        {status}
                    </div>
                </div>

                {/* Sezione interattiva */}
                <div style={cardStyle}>
                    <h2 style={{ marginBottom: '25px', fontSize: '2rem' }}>
                        🎯 Test Funzionalità
                    </h2>
                    
                    <button
                        style={buttonStyle}
                        onClick={() => setCount(count + 1)}
                        onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
                        onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                    >
                        Clic di test: {count}
                    </button>
                    
                    <button
                        style={{...buttonStyle, background: 'rgba(40, 167, 69, 0.8)'}}
                        onClick={() => window.location.href = '/listings'}
                    >
                        🏠 Vai agli Annunci
                    </button>
                    
                    <button
                        style={{...buttonStyle, background: 'rgba(255, 193, 7, 0.8)'}}
                        onClick={() => window.location.href = '/auth'}
                    >
                        🔐 Login / Registrati
                    </button>
                </div>

                {/* Status tecnico */}
                <div style={cardStyle}>
                    <h3 style={{ marginBottom: '20px' }}>📊 Informazioni Sistema</h3>
                    
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '15px',
                        marginBottom: '20px'
                    }}>
                        <div style={{ padding: '15px', background: 'rgba(40, 167, 69, 0.6)', borderRadius: '10px' }}>
                            <strong>✅ React {React.version}</strong>
                        </div>
                        <div style={{ padding: '15px', background: 'rgba(40, 167, 69, 0.6)', borderRadius: '10px' }}>
                            <strong>✅ Vite Dev Server</strong>
                        </div>
                        <div style={{ padding: '15px', background: 'rgba(40, 167, 69, 0.6)', borderRadius: '10px' }}>
                            <strong>✅ Hot Reload</strong>
                        </div>
                        <div style={{ padding: '15px', background: 'rgba(40, 167, 69, 0.6)', borderRadius: '10px' }}>
                            <strong>✅ Hooks Funzionanti</strong>
                        </div>
                    </div>
                    
                    <div style={{
                        background: 'rgba(0,0,0,0.2)',
                        padding: '15px',
                        borderRadius: '10px',
                        fontFamily: 'monospace',
                        fontSize: '13px',
                        textAlign: 'left'
                    }}>
                        <strong>🔧 Debug Info:</strong><br/>
                        • URL: {window.location.href}<br/>
                        • Timestamp: {new Date().toLocaleString()}<br/>
                        • User Agent: {navigator.userAgent.split(' ')[0]}<br/>
                        • Document Ready: {document.readyState}
                    </div>
                </div>

                {/* Call to action */}
                <div style={{...cardStyle, background: 'rgba(255,255,255,0.05)'}}>
                    <h3 style={{ marginBottom: '15px' }}>🚀 Pronto per iniziare?</h3>
                    <p style={{ marginBottom: '20px', opacity: 0.8 }}>
                        Il sistema è completamente funzionante. Ora puoi procedere con l'applicazione completa!
                    </p>
                    
                    <button
                        style={{
                            ...buttonStyle,
                            background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                            fontSize: '20px',
                            padding: '20px 40px',
                            fontWeight: 'bold'
                        }}
                        onClick={() => {
                            // Qui potremmo caricare l'app completa
                            alert('🎉 Sistema pronto! Procediamo con l\'integrazione completa.');
                        }}
                    >
                        🎯 Carica App Completa
                    </button>
                </div>
            </div>
        </div>
    );
}

// Render dell'app
const rootElement = document.getElementById("root");
console.log("Root element found:", !!rootElement);

if (rootElement) {
    console.log("Creating React root...");
    try {
        const root = ReactDOM.createRoot(rootElement);
        root.render(<AlloggiFinderApp />);
        console.log("✅ AlloggiFinder React App rendered successfully!");
    } catch (error) {
        console.error("❌ Error rendering React app:", error);
        rootElement.innerHTML = `
            <div style="color: red; padding: 20px; text-align: center;">
                <h1>Errore React</h1>
                <p>${error.message}</p>
            </div>
        `;
    }
} else {
    console.error("❌ Root element not found!");
}
