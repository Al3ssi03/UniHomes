import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Funzione toast semplice
const showToast = (message, type = 'info') => {
  if (type === 'success') {
    alert(`✅ ${message}`);
  } else if (type === 'error') {
    alert(`❌ ${message}`);
  } else if (type === 'warning') {
    alert(`⚠️ ${message}`);
  } else {
    alert(`ℹ️ ${message}`);
  }
};

const AnnouncementDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    loadAnnouncement();
  }, [id]);

  const loadAnnouncement = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/announcements/${id}`);
      
      if (response.ok) {
        const data = await response.json();
        setAnnouncement(data);
      } else {
        setError('Annuncio non trovato');
      }
    } catch (error) {
      console.error('Errore:', error);
      setError('Errore di connessione');
    } finally {
      setLoading(false);
    }
  };
  const handleContact = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      showToast('Devi effettuare il login per contattare gli utenti', 'warning');
      navigate('/auth');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverId: announcement.userId,
          content: `Ciao! Sono interessato al tuo annuncio "${announcement.titolo}". Puoi darmi maggiori informazioni?`
        })
      });

      if (response.ok) {
        showToast('Messaggio inviato! Controlla la tua inbox per continuare la conversazione.', 'success');
        navigate('/inbox');
      } else {
        const data = await response.json();
        showToast(`Errore: ${data.message}`, 'error');
      }
    } catch (error) {
      console.error('Errore invio messaggio:', error);
      showToast('Errore di connessione', 'error');
    }
  };

  const nextImage = () => {
    if (announcement.immagini && announcement.immagini.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === announcement.immagini.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (announcement.immagini && announcement.immagini.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? announcement.immagini.length - 1 : prev - 1
      );
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento annuncio...</p>
        </div>
      </div>
    );
  }

  if (error || !announcement) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">😞</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Annuncio non trovato</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/listings')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Torna agli Annunci
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/listings')}
            className="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2"
          >
            ← Torna agli Annunci
          </button>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            
            {/* Galleria Immagini */}
            <div className="relative">
              {announcement.immagini && announcement.immagini.length > 0 ? (
                <div className="relative h-96 lg:h-full">
                  <img
                    src={`http://localhost:5000${announcement.immagini[currentImageIndex]}`}
                    alt={announcement.titolo}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.style.background = 'linear-gradient(45deg, #ff9a56, #ff6b9d)';
                      e.target.parentElement.innerHTML = '<div class="flex items-center justify-center h-full text-white text-6xl">🏠</div>';
                    }}
                  />
                  
                  {/* Controlli navigazione immagini */}
                  {announcement.immagini.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-opacity-75 transition-all"
                      >
                        ←
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-opacity-75 transition-all"
                      >
                        →
                      </button>
                      
                      {/* Indicatori */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                        {announcement.immagini.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-3 h-3 rounded-full transition-all ${
                              index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="h-96 lg:h-full bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center">
                  <span className="text-6xl">🏠</span>
                </div>
              )}
            </div>

            {/* Dettagli Annuncio */}
            <div className="p-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  {announcement.titolo}
                </h1>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl font-bold text-blue-600">
                    {formatPrice(announcement.prezzo)}/mese
                  </div>
                  <div className="text-gray-600 flex items-center gap-1">
                    📍 {announcement.città}
                  </div>
                </div>

                {announcement.indirizzo && (
                  <div className="text-gray-600 mb-4">
                    🏠 {announcement.indirizzo}
                  </div>
                )}
              </div>

              {/* Descrizione */}
              {announcement.descrizione && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Descrizione</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {announcement.descrizione}
                  </p>
                </div>
              )}

              {/* Informazioni Proprietario */}
              {announcement.User && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Proprietario</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {announcement.User.nome ? announcement.User.nome.charAt(0) : '?'}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">
                        {announcement.User.nome} {announcement.User.cognome}
                      </div>
                      <div className="text-gray-600 text-sm">
                        @{announcement.User.username}
                      </div>
                      {announcement.User.telefono && (
                        <div className="text-gray-600 text-sm">
                          📞 {announcement.User.telefono}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Informazioni aggiuntive */}
              <div className="mb-6 text-sm text-gray-500">
                <div>📅 Pubblicato il {formatDate(announcement.createdAt)}</div>
                {announcement.updatedAt !== announcement.createdAt && (
                  <div>✏️ Aggiornato il {formatDate(announcement.updatedAt)}</div>
                )}
              </div>

              {/* Azioni */}
              <div className="flex gap-4">
                <button
                  onClick={handleContact}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold"
                >
                  💬 Contatta Proprietario
                </button>
                
                <button
                  onClick={() => window.history.back()}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  ← Indietro
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementDetail;
