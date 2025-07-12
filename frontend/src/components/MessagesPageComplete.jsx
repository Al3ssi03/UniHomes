import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const MessagesPageComplete = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Scrolla automaticamente ai nuovi messaggi
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.partnerId);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setError('Devi effettuare il login per vedere i messaggi');
        navigate('/auth');
        return;
      }

      const response = await fetch('http://localhost:5000/api/messages/conversations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setConversations(data);
        console.log('💬 Conversazioni caricate:', data.length);
      } else if (response.status === 401) {
        setError('Sessione scaduta, rieffettua il login');
        navigate('/auth');
      } else {
        setError(`Errore nel caricamento: ${response.status}`);
      }
    } catch (error) {
      console.error('Errore fetch conversazioni:', error);
      setError('Errore di connessione al server');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (partnerId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/messages/conversation/${partnerId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
        console.log('💬 Messaggi caricati:', data.messages?.length || 0);
      } else {
        console.error('Errore nel caricamento dei messaggi:', response.status);
      }
    } catch (error) {
      console.error('Errore fetch messaggi:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sendingMessage) return;

    setSendingMessage(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          recipientId: selectedConversation.partnerId,
          content: newMessage.trim()
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, data.data]);
        setNewMessage('');
        
        // Aggiorna la conversazione nell'elenco
        setConversations(prev => prev.map(conv => 
          conv.partnerId === selectedConversation.partnerId 
            ? { ...conv, lastMessage: data.data }
            : conv
        ));
      } else {
        alert('❌ Errore nell\'invio del messaggio');
      }
    } catch (error) {
      console.error('Errore invio messaggio:', error);
      alert('❌ Errore di connessione');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString('it-IT', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' });
    }
  };

  const getCurrentUserId = () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData).id : null;
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    },
    content: {
      maxWidth: '1400px',
      margin: '0 auto',
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      height: '90vh'
    },
    header: {
      padding: '20px 30px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    title: {
      margin: 0,
      color: 'white',
      fontSize: '1.8rem',
      fontWeight: '700'
    },
    backButton: {
      background: 'rgba(255, 255, 255, 0.2)',
      border: 'none',
      borderRadius: '10px',
      color: 'white',
      padding: '10px 20px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      ':hover': {
        background: 'rgba(255, 255, 255, 0.3)'
      }
    },
    body: {
      display: 'flex',
      height: 'calc(100% - 80px)'
    },
    sidebar: {
      width: '350px',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRight: '1px solid rgba(255, 255, 255, 0.1)',
      overflowY: 'auto'
    },
    conversationList: {
      padding: '10px'
    },
    conversationItem: {
      padding: '15px',
      borderRadius: '12px',
      margin: '5px 0',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      background: 'rgba(255, 255, 255, 0.05)',
      ':hover': {
        background: 'rgba(255, 255, 255, 0.1)'
      }
    },
    conversationItemActive: {
      background: 'rgba(255, 255, 255, 0.2)',
      borderLeft: '4px solid #00ff88'
    },
    chatArea: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column'
    },
    chatHeader: {
      padding: '20px 30px',
      background: 'rgba(255, 255, 255, 0.05)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      color: 'white'
    },
    messagesContainer: {
      flex: 1,
      padding: '20px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    },
    messageItem: {
      maxWidth: '70%',
      padding: '12px 16px',
      borderRadius: '18px',
      wordWrap: 'break-word'
    },
    messageOwn: {
      alignSelf: 'flex-end',
      background: 'linear-gradient(135deg, #00ff88, #00cc66)',
      color: 'white'
    },
    messageOther: {
      alignSelf: 'flex-start',
      background: 'rgba(255, 255, 255, 0.9)',
      color: '#333'
    },
    inputArea: {
      padding: '20px 30px',
      background: 'rgba(255, 255, 255, 0.05)',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      gap: '15px',
      alignItems: 'flex-end'
    },
    messageInput: {
      flex: 1,
      padding: '12px 16px',
      borderRadius: '25px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      background: 'rgba(255, 255, 255, 0.1)',
      color: 'white',
      fontSize: '16px',
      outline: 'none',
      resize: 'none',
      minHeight: '20px',
      maxHeight: '100px'
    },
    sendButton: {
      background: 'linear-gradient(135deg, #00ff88, #00cc66)',
      border: 'none',
      borderRadius: '50%',
      width: '50px',
      height: '50px',
      color: 'white',
      cursor: 'pointer',
      fontSize: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease',
      ':hover': {
        transform: 'scale(1.05)'
      }
    },
    emptyState: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      textAlign: 'center',
      padding: '40px'
    },
    loading: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      color: 'white'
    },
    errorState: {
      padding: '40px',
      textAlign: 'center',
      color: 'white'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.loading}>
            <div style={{
              width: '50px',
              height: '50px',
              border: '4px solid rgba(255, 255, 255, 0.3)',
              borderTop: '4px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '20px'
            }}></div>
            <h2>Caricamento messaggi...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.errorState}>
            <h2>❌ Errore</h2>
            <p>{error}</p>
            <button 
              style={styles.backButton}
              onClick={() => navigate('/listings')}
            >
              🏠 Torna agli Annunci
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>💬 I Tuoi Messaggi</h1>
          <button 
            style={styles.backButton}
            onClick={() => navigate('/listings')}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
          >
            ← Torna agli Annunci
          </button>
        </div>

        <div style={styles.body}>
          {/* Sidebar Conversazioni */}
          <div style={styles.sidebar}>
            {conversations.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📭</div>
                <h3>Nessuna Conversazione</h3>
                <p style={{ opacity: 0.8, marginBottom: '20px' }}>
                  Inizia contattando i proprietari degli annunci!
                </p>
                <button 
                  style={styles.backButton}
                  onClick={() => navigate('/listings')}
                >
                  🔍 Cerca Annunci
                </button>
              </div>
            ) : (
              <div style={styles.conversationList}>
                <h3 style={{ color: 'white', padding: '10px 5px', margin: '0 0 10px 0' }}>
                  Conversazioni ({conversations.length})
                </h3>
                {conversations.map((conv) => (
                  <div
                    key={conv.partnerId}
                    style={{
                      ...styles.conversationItem,
                      ...(selectedConversation?.partnerId === conv.partnerId ? styles.conversationItemActive : {})
                    }}
                    onClick={() => setSelectedConversation(conv)}
                    onMouseEnter={(e) => !selectedConversation || selectedConversation.partnerId !== conv.partnerId ? 
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)' : null}
                    onMouseLeave={(e) => !selectedConversation || selectedConversation.partnerId !== conv.partnerId ? 
                      e.target.style.background = 'rgba(255, 255, 255, 0.05)' : null}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'linear-gradient(135deg, #00ff88, #00cc66)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: 'white'
                      }}>
                        {(conv.partner.nome || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: '0 0 5px 0', fontWeight: '600', color: 'white' }}>
                          {conv.partner.nome} {conv.partner.cognome}
                        </p>
                        <p style={{ margin: 0, fontSize: '14px', opacity: 0.7, color: 'white' }}>
                          {conv.lastMessage?.contenuto?.substring(0, 50) || 'Nessun messaggio'}
                          {conv.lastMessage?.contenuto?.length > 50 ? '...' : ''}
                        </p>
                        <p style={{ margin: '5px 0 0 0', fontSize: '12px', opacity: 0.5, color: 'white' }}>
                          {conv.lastMessage?.createdAt ? formatTime(conv.lastMessage.createdAt) : ''}
                        </p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <div style={{
                          background: '#ff4444',
                          color: 'white',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          {conv.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Area Chat */}
          <div style={styles.chatArea}>
            {selectedConversation ? (
              <>
                {/* Header Chat */}
                <div style={styles.chatHeader}>
                  <h3 style={{ margin: '0 0 5px 0' }}>
                    {selectedConversation.partner.nome} {selectedConversation.partner.cognome}
                  </h3>
                  <p style={{ margin: 0, opacity: 0.7, fontSize: '14px' }}>
                    @{selectedConversation.partner.username}
                  </p>
                </div>

                {/* Messaggi */}
                <div style={styles.messagesContainer}>
                  {messages.length === 0 ? (
                    <div style={styles.emptyState}>
                      <div style={{ fontSize: '3rem', marginBottom: '20px' }}>💭</div>
                      <h3>Inizia la conversazione!</h3>
                      <p style={{ opacity: 0.8 }}>
                        Scrivi il primo messaggio a {selectedConversation.partner.nome}
                      </p>
                    </div>
                  ) : (
                    messages.map((message) => {
                      const isOwn = message.senderId === getCurrentUserId();
                      return (
                        <div
                          key={message.id}
                          style={{
                            ...styles.messageItem,
                            ...(isOwn ? styles.messageOwn : styles.messageOther)
                          }}
                        >
                          <p style={{ margin: '0 0 5px 0' }}>{message.contenuto}</p>
                          <p style={{ 
                            margin: 0, 
                            fontSize: '12px', 
                            opacity: 0.7,
                            textAlign: isOwn ? 'right' : 'left'
                          }}>
                            {formatTime(message.createdAt)}
                          </p>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Messaggio */}
                <div style={styles.inputArea}>
                  <textarea
                    style={styles.messageInput}
                    placeholder={`Scrivi un messaggio a ${selectedConversation.partner.nome}...`}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    rows={1}
                  />
                  <button
                    style={{
                      ...styles.sendButton,
                      opacity: sendingMessage || !newMessage.trim() ? 0.5 : 1,
                      cursor: sendingMessage || !newMessage.trim() ? 'not-allowed' : 'pointer'
                    }}
                    onClick={sendMessage}
                    disabled={sendingMessage || !newMessage.trim()}
                    onMouseEnter={(e) => {
                      if (!sendingMessage && newMessage.trim()) {
                        e.target.style.transform = 'scale(1.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    {sendingMessage ? '⏳' : '📤'}
                  </button>
                </div>
              </>
            ) : (
              <div style={styles.emptyState}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>💬</div>
                <h3>Seleziona una conversazione</h3>
                <p style={{ opacity: 0.8 }}>
                  Scegli una conversazione dalla lista per iniziare a chattare
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        input::placeholder, textarea::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }
        
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default MessagesPageComplete;
