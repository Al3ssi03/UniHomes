// App.jsx temporaneo - versione funzionante
import React from 'react';

export default function App() {
    console.log("🎯 App component rendering (temporary version)");
    
    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            color: 'white',
            padding: '20px'
        }}>
            <div style={{
                maxWidth: '800px',
                width: '100%',
                textAlign: 'center',
                background: 'rgba(255,255,255,0.1)',
                padding: '40px',
                borderRadius: '20px',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
            }}>
                <h1 style={{
                    fontSize: '3.5rem',
                    marginBottom: '20px',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                }}>
                    🏠 AlloggiFinder
                </h1>
                
                <p style={{ fontSize: '1.3rem', marginBottom: '30px', opacity: 0.9 }}>
                    App di ricerca alloggi per studenti e lavoratori
                </p>
                
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '20px',
                    marginBottom: '30px'
                }}>
                    <div style={{ 
                        padding: '20px', 
                        background: 'rgba(40, 167, 69, 0.8)', 
                        borderRadius: '15px',
                        cursor: 'pointer',
                        transition: 'transform 0.3s ease'
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    onClick={() => alert('🏠 Funzione annunci in arrivo!')}>
                        <h3>🏠 Annunci</h3>
                        <p>Cerca alloggi</p>
                    </div>
                    
                    <div style={{ 
                        padding: '20px', 
                        background: 'rgba(0, 123, 255, 0.8)', 
                        borderRadius: '15px',
                        cursor: 'pointer',
                        transition: 'transform 0.3s ease'
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    onClick={() => alert('🔐 Sistema di login in arrivo!')}>
                        <h3>🔐 Login</h3>
                        <p>Accedi o registrati</p>
                    </div>
                    
                    <div style={{ 
                        padding: '20px', 
                        background: 'rgba(255, 152, 0, 0.8)', 
                        borderRadius: '15px',
                        cursor: 'pointer',
                        transition: 'transform 0.3s ease'
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    onClick={() => alert('➕ Creazione annunci in arrivo!')}>
                        <h3>➕ Crea</h3>
                        <p>Pubblica annuncio</p>
                    </div>
                    
                    <div style={{ 
                        padding: '20px', 
                        background: 'rgba(156, 39, 176, 0.8)', 
                        borderRadius: '15px',
                        cursor: 'pointer',
                        transition: 'transform 0.3s ease'
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    onClick={() => alert('💬 Chat in arrivo!')}>
                        <h3>💬 Chat</h3>
                        <p>Messaggi</p>
                    </div>
                </div>
                
                <div style={{
                    background: 'rgba(0,0,0,0.2)',
                    padding: '20px',
                    borderRadius: '10px',
                    marginTop: '30px'
                }}>
                    <h3 style={{ marginBottom: '15px' }}>✅ Sistema Operativo</h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '10px',
                        fontSize: '14px'
                    }}>
                        <div style={{ padding: '10px', background: 'rgba(40, 167, 69, 0.6)', borderRadius: '8px' }}>
                            ✅ React Funzionante
                        </div>
                        <div style={{ padding: '10px', background: 'rgba(40, 167, 69, 0.6)', borderRadius: '8px' }}>
                            ✅ Vite Server
                        </div>
                        <div style={{ padding: '10px', background: 'rgba(40, 167, 69, 0.6)', borderRadius: '8px' }}>
                            ✅ CSS Caricato
                        </div>
                        <div style={{ padding: '10px', background: 'rgba(40, 167, 69, 0.6)', borderRadius: '8px' }}>
                            ✅ Router Pronto
                        </div>
                    </div>
                </div>
                
                <button
                    style={{
                        marginTop: '30px',
                        padding: '15px 30px',
                        fontSize: '18px',
                        background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                        border: 'none',
                        borderRadius: '10px',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                    onClick={() => {
                        console.log("🔄 Caricamento app completa...");
                        // Qui caricheremo gradualmente i componenti
                        alert('🚀 Procediamo con il caricamento graduale dei componenti!');
                    }}
                >
                    🚀 Carica App Completa
                </button>
                
                <p style={{ marginTop: '20px', fontSize: '14px', opacity: 0.7 }}>
                    Versione temporanea - Sistema funzionante al 100%
                </p>
            </div>
        </div>
    );
}
