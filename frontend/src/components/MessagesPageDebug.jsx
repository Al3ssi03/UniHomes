import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MessagesPageDebug = () => {
  console.log('📨 [MessagesPageDebug] Componente caricato!');
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    console.log('📨 [MessagesPageDebug] useEffect eseguito');
    // Wrap fetchConversations in try-catch per sicurezza
    const safeLoadConversations = async () => {
      try {
        await fetchConversations();
      } catch (error) {
        console.error('📨 [MessagesPageDebug] Errore critico in useEffect:', error);
        setError(`Errore critico: ${error.message}`);
        setLoading(false);
      }
    };
    
    safeLoadConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      console.log('📨 [MessagesPageDebug] Inizio fetch conversazioni...');
      setDebugInfo('Caricamento conversazioni...');
      
      const token = localStorage.getItem('authToken');
      console.log('📨 [MessagesPageDebug] Token:', token ? 'presente' : 'mancante');
      setDebugInfo(prev => (prev || '') + `\nToken: ${token ? 'presente' : 'mancante'}`);
      
      if (!token) {
        throw new Error('Token mancante - utente non autenticato');
      }
      
      const response = await fetch('http://localhost:5000/api/messages/conversations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📨 [MessagesPageDebug] Response status:', response.status);
      setDebugInfo(prev => (prev || '') + `\nResponse status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📨 [MessagesPageDebug] Dati ricevuti:', data);
        
        // Sicurezza: assicurati che data sia un array
        const conversationsArray = Array.isArray(data) ? data : [];
        setDebugInfo(prev => (prev || '') + `\nConversazioni trovate: ${conversationsArray.length}`);
        setConversations(conversationsArray);
      } else {
        const errorText = await response.text();
        console.error('📨 [MessagesPageDebug] Errore API:', response.status, errorText);
        setDebugInfo(prev => (prev || '') + `\nErrore API: ${response.status} - ${errorText}`);
        setError(`Errore API: ${response.status}`);
      }
    } catch (error) {
      console.error('📨 [MessagesPageDebug] Errore catch:', error);
      setDebugInfo(prev => (prev || '') + `\nErrore: ${error.message}`);
      setError(error.message);
    } finally {
      console.log('📨 [MessagesPageDebug] Caricamento completato');
      setDebugInfo(prev => (prev || '') + '\nCaricamento completato!');
      setLoading(false);
    }
  };

  console.log('📨 [MessagesPageDebug] Render - loading:', loading, 'error:', error, 'conversations:', conversations?.length || 0);

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      color: 'white'
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
      marginBottom: '20px'
    },
    debugBox: {
      background: 'rgba(0, 0, 0, 0.3)',
      padding: '15px',
      borderRadius: '10px',
      fontFamily: 'monospace',
      fontSize: '14px',
      marginTop: '20px',
      whiteSpace: 'pre-wrap'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <h1>🔄 Caricamento Messaggi...</h1>
          <div style={styles.debugBox}>{debugInfo}</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <button style={styles.button} onClick={() => navigate('/listings')}>
            ← Torna agli Annunci
          </button>
          <h1>❌ Errore nel Caricamento</h1>
          <p>Si è verificato un errore nel caricamento dei messaggi:</p>
          <div style={styles.debugBox}>{error}</div>
          <div style={styles.debugBox}>{debugInfo}</div>
          <button 
            style={{...styles.button, marginTop: '20px'}}
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchConversations();
            }}
          >
            🔄 Riprova
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <button style={styles.button} onClick={() => navigate('/listings')}>
          ← Torna agli Annunci
        </button>
        
        <h1>💬 I Tuoi Messaggi</h1>
        
        {conversations && conversations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h2>📭 Nessun Messaggio</h2>
            <p>Non hai ancora conversazioni. Inizia contattando i proprietari degli annunci!</p>
            <button 
              style={{...styles.button, marginTop: '20px'}}
              onClick={() => navigate('/listings')}
            >
              🏠 Vai agli Annunci
            </button>
          </div>
        ) : (
          <div>
            <h3>Conversazioni ({conversations?.length || 0}):</h3>
            {conversations && conversations.map((conv, index) => {
              // Sicurezza: controlla che conv e le sue proprietà esistano
              if (!conv) return null;
              
              const partner = conv.partner || {};
              const lastMessage = conv.lastMessage || {};
              
              return (
                <div key={conv.partnerId || index} style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '15px',
                  borderRadius: '10px',
                  marginBottom: '10px'
                }}>
                  <strong>
                    {partner.nome || 'Nome non disponibile'} {partner.cognome || ''}
                  </strong>
                  <p style={{ margin: '5px 0 0 0', opacity: 0.8 }}>
                    {lastMessage.createdAt ? (
                      `Ultimo messaggio: ${new Date(lastMessage.createdAt).toLocaleDateString('it-IT')}`
                    ) : (
                      'Data non disponibile'
                    )}
                  </p>
                  {lastMessage.contenuto && (
                    <p style={{ margin: '5px 0 0 0', opacity: 0.6, fontSize: '0.9em' }}>
                      "{lastMessage.contenuto.substring(0, 50)}..."
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
        
        <div style={styles.debugBox}>
          <strong>DEBUG INFO:</strong>
          {debugInfo}
        </div>
      </div>
    </div>
  );
};

export default MessagesPageDebug;
