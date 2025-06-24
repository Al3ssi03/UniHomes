import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MessagesPage = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    },
    content: {
      maxWidth: '1200px',
      margin: '0 auto',
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      overflow: 'hidden',
      height: 'calc(100vh - 40px)'
    },
    header: {
      padding: '20px 30px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      color: 'white'
    },
    title: {
      fontSize: '1.8rem',
      fontWeight: '700',
      margin: 0,
      background: 'linear-gradient(135deg, #fff, #e0e7ff)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    body: {
      display: 'flex',
      height: 'calc(100% - 80px)'
    },
    sidebar: {
      width: '350px',
      borderRight: '1px solid rgba(255, 255, 255, 0.1)',
      background: 'rgba(255, 255, 255, 0.05)'
    },
    conversationList: {
      overflowY: 'auto',
      height: '100%'
    },
    conversationItem: {
      padding: '15px 20px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      cursor: 'pointer',
      color: 'white',
      transition: 'all 0.3s ease'
    },
    conversationItemActive: {
      background: 'rgba(255, 255, 255, 0.1)'
    },
    chatArea: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column'
    },
    chatHeader: {
      padding: '20px 30px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      color: 'white',
      background: 'rgba(255, 255, 255, 0.05)'
    },
    messagesContainer: {
      flex: 1,
      overflowY: 'auto',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    },
    messageItem: {
      maxWidth: '70%',
      padding: '12px 16px',
      borderRadius: '15px',
      wordBreak: 'break-word'
    },
    messageOwn: {
      alignSelf: 'flex-end',
      background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
      color: 'white'
    },
    messageOther: {
      alignSelf: 'flex-start',
      background: 'rgba(255, 255, 255, 0.15)',
      color: 'white'
    },
    inputArea: {
      padding: '20px',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      gap: '10px'
    },
    messageInput: {
      flex: 1,
      padding: '12px 16px',
      borderRadius: '25px',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      background: 'rgba(255, 255, 255, 0.1)',
      color: 'white',
      fontSize: '16px'
    },
    sendButton: {
      padding: '12px 20px',
      borderRadius: '25px',
      border: 'none',
      background: 'linear-gradient(135deg, #10b981, #059669)',
      color: 'white',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600'
    },
    emptyState: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      color: 'white',
      textAlign: 'center',
      flexDirection: 'column',
      gap: '20px'
    }
  };

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
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/messages/conversations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      }
    } catch (error) {
      console.error('Errore nel caricamento delle conversazioni:', error);
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
        setMessages(data);
      }
    } catch (error) {
      console.error('Errore nel caricamento dei messaggi:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

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
          receiverId: selectedConversation.partnerId,
          content: newMessage
        })
      });

      if (response.ok) {
        setNewMessage('');
        fetchMessages(selectedConversation.partnerId);
      }
    } catch (error) {
      console.error('Errore nell\'invio del messaggio:', error);
      alert('❌ Errore nell\'invio del messaggio');
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

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTop: '4px solid #fff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p>Caricamento messaggi...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>💬 I Tuoi Messaggi</h1>
          <p style={{ margin: '10px 0 0 0', opacity: 0.8 }}>
            Gestisci le conversazioni con proprietari e inquilini
          </p>
        </div>

        <div style={styles.body}>
          {/* Sidebar Conversazioni */}
          <div style={styles.sidebar}>
            {conversations.length === 0 ? (
              <div style={styles.emptyState}>
                <p>📭 Nessuna conversazione</p>
                <button
                  style={{
                    padding: '10px 20px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate('/listings')}
                >
                  Cerca Annunci
                </button>
              </div>
            ) : (
              <div style={styles.conversationList}>
                {conversations.map((conv) => (
                  <div
                    key={conv.partnerId}
                    style={{
                      ...styles.conversationItem,
                      ...(selectedConversation?.partnerId === conv.partnerId ? styles.conversationItemActive : {})
                    }}
                    onClick={() => setSelectedConversation(conv)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px'
                      }}>
                        👤
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: '0 0 5px 0', fontWeight: '600' }}>
                          {conv.partner.nome} {conv.partner.cognome}
                        </p>
                        <p style={{ margin: 0, fontSize: '14px', opacity: 0.7 }}>
                          {conv.lastMessage.content.substring(0, 50)}...
                        </p>
                      </div>
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
                <div style={styles.chatHeader}>
                  <h3 style={{ margin: 0 }}>
                    {selectedConversation.partner.nome} {selectedConversation.partner.cognome}
                  </h3>
                  <p style={{ margin: '5px 0 0 0', opacity: 0.7, fontSize: '14px' }}>
                    {selectedConversation.partner.username}
                  </p>
                </div>

                <div style={styles.messagesContainer}>
                  {messages.map((message) => {
                    const isOwn = message.senderId === parseInt(localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')).id : 0);
                    return (
                      <div
                        key={message.id}
                        style={{
                          ...styles.messageItem,
                          ...(isOwn ? styles.messageOwn : styles.messageOther)
                        }}
                      >
                        <p style={{ margin: '0 0 5px 0' }}>{message.content}</p>
                        <p style={{ 
                          margin: 0, 
                          fontSize: '12px', 
                          opacity: 0.7,
                          textAlign: isOwn ? 'right' : 'left'
                        }}>
                          {new Date(message.createdAt).toLocaleString('it-IT')}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div style={styles.inputArea}>
                  <input
                    type="text"
                    style={styles.messageInput}
                    placeholder="Scrivi un messaggio..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button
                    style={styles.sendButton}
                    onClick={sendMessage}
                    disabled={sendingMessage || !newMessage.trim()}
                  >
                    {sendingMessage ? '⏳' : '📤'}
                  </button>
                </div>
              </>
            ) : (
              <div style={styles.emptyState}>
                <h3>💬 Seleziona una conversazione</h3>
                <p>Scegli una conversazione dalla lista per iniziare a chattare</p>
              </div>
            )}
          </div>
        </div>

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          input::placeholder {
            color: rgba(255, 255, 255, 0.6);
          }
        `}</style>
      </div>
    </div>
  );
};

export default MessagesPage;
