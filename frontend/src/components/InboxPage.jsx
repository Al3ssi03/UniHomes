import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const InboxPage = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Verifica autenticazione
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
      return;
    }

    // Decodifica il token per ottenere l'ID dell'utente
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setCurrentUser({ id: payload.userId, username: payload.username });
      loadConversations();
    } catch (error) {
      console.error('Token non valido:', error);
      navigate('/auth');
    }
  }, [navigate]);

  const loadConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/messages/conversations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      } else {
        setError('Errore nel caricamento delle conversazioni');
      }
    } catch (error) {
      console.error('Errore:', error);
      setError('Errore di connessione');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/messages/conversation/${conversationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        setError('Errore nel caricamento dei messaggi');
      }
    } catch (error) {
      console.error('Errore:', error);
      setError('Errore di connessione');
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverId: selectedConversation.otherUser.id,
          content: newMessage.trim()
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, data.message]);
        setNewMessage('');
        // Aggiorna l'ultima attività della conversazione
        setConversations(prev => 
          prev.map(conv => 
            conv.id === selectedConversation.id 
              ? { ...conv, lastMessage: data.message }
              : conv
          )
        );
      } else {
        setError('Errore nell\'invio del messaggio');
      }
    } catch (error) {
      console.error('Errore:', error);
      setError('Errore di connessione');
    }
  };

  const selectConversation = (conversation) => {
    setSelectedConversation(conversation);
    loadMessages(conversation.id);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString('it-IT', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento messaggi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800">💬 I tuoi Messaggi</h1>
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← Torna alla Home
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Chat Interface */}
        <div className="flex-1 glass-card flex overflow-hidden">
          {/* Sidebar - Lista Conversazioni */}
          <div className="w-1/3 border-r border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Conversazioni</h2>
            
            {conversations.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">💬</div>
                <p className="text-gray-600">Nessuna conversazione ancora</p>
                <p className="text-sm text-gray-500 mt-2">
                  Contatta qualcuno da un annuncio per iniziare a chattare!
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => selectConversation(conversation)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedConversation?.id === conversation.id
                        ? 'bg-blue-100 border-blue-300'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">
                          {conversation.otherUser.nome} {conversation.otherUser.cognome}
                        </h3>
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.lastMessage?.content || 'Nessun messaggio'}
                        </p>
                      </div>
                      <div className="text-xs text-gray-500">
                        {conversation.lastMessage && formatTime(conversation.lastMessage.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Area Chat */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Header Conversazione */}
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-800">
                    {selectedConversation.otherUser.nome} {selectedConversation.otherUser.cognome}
                  </h3>
                  <p className="text-sm text-gray-600">@{selectedConversation.otherUser.username}</p>
                </div>

                {/* Messaggi */}
                <div className="flex-1 p-4 overflow-y-auto">
                  {messages.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600">Inizia la conversazione!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.senderId === currentUser?.id ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.senderId === currentUser?.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-800'
                            }`}
                          >
                            <p>{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.senderId === currentUser?.id ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {formatTime(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Input Messaggio */}
                <div className="p-4 border-t border-gray-200">
                  <form onSubmit={sendMessage} className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Scrivi un messaggio..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Invia
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">💬</div>
                  <p className="text-xl text-gray-600">Seleziona una conversazione</p>
                  <p className="text-gray-500 mt-2">Scegli una conversazione dalla lista per iniziare a chattare</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InboxPage;
