import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [userAnnouncements, setUserAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verifica autenticazione
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
      return;
    }

    // Decodifica il token per ottenere info utente
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({ id: payload.userId, username: payload.username });
      loadUserAnnouncements();
    } catch (error) {
      console.error('Token non valido:', error);
      navigate('/auth');
    }
  }, [navigate]);
  const loadUserAnnouncements = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/announcements/user/my-announcements', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserAnnouncements(data);
      } else if (response.status === 404) {
        // Endpoint non trovato, implementiamo una soluzione alternativa
        // Otteniamo tutti gli annunci e filtriamo per l'utente corrente
        const allAnnouncementsResponse = await fetch('http://localhost:5000/api/announcements');
        if (allAnnouncementsResponse.ok) {
          const allAnnouncements = await allAnnouncementsResponse.json();
          const payload = JSON.parse(atob(token.split('.')[1]));
          const userAnns = allAnnouncements.filter(ann => ann.userId === payload.userId);
          setUserAnnouncements(userAnns);
        }
      } else {
        setError('Errore nel caricamento degli annunci');
      }
    } catch (error) {
      console.error('Errore:', error);
      setError('Errore di connessione');
    } finally {
      setLoading(false);
    }
  };

  const deleteAnnouncement = async (id) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo annuncio?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/announcements/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setUserAnnouncements(prev => prev.filter(ann => ann.id !== id));
      } else {
        setError('Errore nell\'eliminazione dell\'annuncio');
      }
    } catch (error) {
      console.error('Errore:', error);
      setError('Errore di connessione');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">👤 La tua Dashboard</h1>
              <p className="text-gray-600">Gestisci i tuoi annunci e il tuo profilo</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← Torna alla Home
            </button>
          </div>

          {user && (
            <div className="glass-card p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Benvenuto, @{user.username}!
              </h2>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/crea')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  ➕ Nuovo Annuncio
                </button>
                <button
                  onClick={() => navigate('/inbox')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  💬 Messaggi
                </button>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* I tuoi Annunci */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">🏠 I tuoi Annunci</h2>
            <span className="text-sm text-gray-600">
              {userAnnouncements.length} annuncio{userAnnouncements.length !== 1 ? 'i' : ''}
            </span>
          </div>

          {userAnnouncements.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏠</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Non hai ancora pubblicato annunci
              </h3>
              <p className="text-gray-600 mb-6">
                Inizia a condividere la tua sistemazione con studenti e lavoratori
              </p>
              <button
                onClick={() => navigate('/crea')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                ➕ Pubblica il tuo primo annuncio
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userAnnouncements.map((announcement) => (
                <div key={announcement.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Immagine */}
                  <div className="h-48 bg-gray-200 relative">
                    {announcement.immagini && announcement.immagini.length > 0 ? (
                      <img
                        src={`http://localhost:5000${announcement.immagini[0]}`}
                        alt={announcement.titolo}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl">🏠</span>
                      </div>
                    )}
                    
                    {/* Badge prezzo */}
                    <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {formatPrice(announcement.prezzo)}/mese
                    </div>
                  </div>

                  {/* Contenuto */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                      {announcement.titolo}
                    </h3>
                    
                    <div className="flex items-center text-gray-600 text-sm mb-2">
                      <span className="mr-4">📍 {announcement.città}</span>
                    </div>

                    {announcement.descrizione && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {announcement.descrizione}
                      </p>
                    )}

                    <div className="text-xs text-gray-500 mb-4">
                      Pubblicato il {formatDate(announcement.createdAt)}
                    </div>

                    {/* Azioni */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/annuncio/${announcement.id}`)}
                        className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors"
                      >
                        👁️ Visualizza
                      </button>
                      <button
                        onClick={() => navigate(`/modifica/${announcement.id}`)}
                        className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200 transition-colors"
                      >
                        ✏️ Modifica
                      </button>
                      <button
                        onClick={() => deleteAnnouncement(announcement.id)}
                        className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded text-sm hover:bg-red-200 transition-colors"
                      >
                        🗑️ Elimina
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Statistiche */}
        {userAnnouncements.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {userAnnouncements.length}
              </div>
              <div className="text-gray-600">Annunci Pubblicati</div>
            </div>
            
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {userAnnouncements.filter(a => a.createdAt > new Date(Date.now() - 30*24*60*60*1000)).length}
              </div>
              <div className="text-gray-600">Annunci questo mese</div>
            </div>
            
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {Math.round(userAnnouncements.reduce((sum, a) => sum + a.prezzo, 0) / userAnnouncements.length) || 0}€
              </div>
              <div className="text-gray-600">Prezzo Medio</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
