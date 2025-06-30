import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MessagesPageSafe = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setError('Non sei autenticato');
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:5000/api/messages/conversations', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setConversations(Array.isArray(data) ? data : []);
        } else {
          setError(`Errore ${response.status}: ${response.statusText}`);
        }
      } catch (err) {
        setError(`Errore di connessione: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, []);

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    content: {
      maxWidth: '800px',
      margin: '0 auto',
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      padding: '30px',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    },
    button: {
      background: 'rgba(255, 255, 255, 0.2)',
      border: 'none',
      borderRadius: '12px',
      padding: '12px 20px',
      color: 'white',
      cursor: 'pointer',
      marginBottom: '20px',
      transition: 'background 0.3s ease'
    },
    conversationCard: {
      background: 'rgba(255, 255, 255, 0.1)',
      padding: '20px',
      borderRadius: '12px',
      marginBottom: '15px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      transition: 'transform 0.2s ease',
      cursor: 'pointer'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <h1>🔄 Caricamento messaggi...</h1>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              border: '4px solid rgba(255, 255, 255, 0.3)',
              borderTop: '4px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <button 
          style={styles.button} 
          onClick={() => navigate('/listings')}
          onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
          onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
        >
          ← Torna agli Annunci
        </button>
        
        <h1 style={{ marginBottom: '30px' }}>💬 I Tuoi Messaggi</h1>
        
        {error ? (
          <div style={{
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.5)',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <h3>❌ Errore</h3>
            <p>{error}</p>
            <button 
              style={styles.button}
              onClick={() => {
                setError(null);
                setLoading(true);
                window.location.reload();
              }}
            >
              🔄 Riprova
            </button>
          </div>
        ) : conversations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📭</div>
            <h2>Nessun Messaggio</h2>
            <p style={{ opacity: 0.8, marginBottom: '30px' }}>
              Non hai ancora conversazioni. Inizia contattando i proprietari degli annunci!
            </p>
            <button 
              style={{
                ...styles.button,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                padding: '15px 30px',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
              onClick={() => navigate('/listings')}
            >
              🏠 Esplora Annunci
            </button>
          </div>
        ) : (
          <div>
            <p style={{ opacity: 0.8, marginBottom: '20px' }}>
              Hai {conversations.length} conversazione{conversations.length !== 1 ? 'i' : ''}
            </p>
            
            {conversations.map((conv, index) => {
              const partner = conv?.partner || {};
              const lastMessage = conv?.lastMessage || {};
              
              return (
                <div 
                  key={conv?.partnerId || index} 
                  style={styles.conversationCard}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>
                        👤 {partner.nome || 'Utente'} {partner.cognome || ''}
                      </h3>
                      
                      {lastMessage.contenuto && (
                        <p style={{ 
                          margin: '0 0 10px 0', 
                          opacity: 0.7,
                          fontSize: '0.95rem',
                          fontStyle: 'italic'
                        }}>
                          "{lastMessage.contenuto.length > 100 
                            ? lastMessage.contenuto.substring(0, 100) + '...' 
                            : lastMessage.contenuto}"
                        </p>
                      )}
                      
                      <div style={{ fontSize: '0.85rem', opacity: 0.6 }}>
                        {lastMessage.createdAt ? (
                          <>🕒 {new Date(lastMessage.createdAt).toLocaleDateString('it-IT', {
                            day: 'numeric',
                            month: 'long',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</>
                        ) : (
                          '🕒 Data non disponibile'
                        )}
                      </div>
                    </div>
                    
                    {conv.unreadCount > 0 && (
                      <div style={{
                        background: '#ef4444',
                        color: 'white',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        marginLeft: '15px'
                      }}>
                        {conv.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        <div style={{
          marginTop: '40px',
          padding: '20px',
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '12px',
          fontSize: '0.9rem',
          opacity: 0.7
        }}>
          💡 <strong>Suggerimento:</strong> La messaggistica completa con chat in tempo reale sarà disponibile presto. 
          Per ora puoi vedere le conversazioni avviate tramite i contatti negli annunci.
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default MessagesPageSafe;
