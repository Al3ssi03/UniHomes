import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const AnnouncementDetailSimpleMap = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  const [nearbyUniversities, setNearbyUniversities] = useState([]);

  // Lista università italiane principali
  const universities = [
    { name: "Sapienza Università di Roma", lat: 41.9028, lng: 12.4964, city: "Roma" },
    { name: "Università Bocconi", lat: 45.4439, lng: 9.1906, city: "Milano" },
    { name: "Politecnico di Milano", lat: 45.4781, lng: 9.2277, city: "Milano" },
    { name: "Università di Bologna", lat: 44.4949, lng: 11.3426, city: "Bologna" },
    { name: "Università di Firenze", lat: 43.7696, lng: 11.2558, city: "Firenze" },
    { name: "Università Federico II", lat: 40.8518, lng: 14.2681, city: "Napoli" },
    { name: "Università di Torino", lat: 45.0703, lng: 7.6869, city: "Torino" },
    { name: "Università di Padova", lat: 45.4064, lng: 11.8768, city: "Padova" },
    { name: "Università Cattolica Milano", lat: 45.4654, lng: 9.1859, city: "Milano" },
    { name: "Università di Pisa", lat: 43.7228, lng: 10.4017, city: "Pisa" },
    { name: "Università di Venezia Ca' Foscari", lat: 45.4343, lng: 12.3256, city: "Venezia" },
    { name: "Università di Genova", lat: 44.4056, lng: 8.9463, city: "Genova" }
  ];

  useEffect(() => {
    fetchAnnouncement();
  }, [id]);

  const fetchAnnouncement = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/announcements/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Errore ${response.status}`);
      }
      
      const data = await response.json();
      setAnnouncement(data);
      
      if (data.indirizzo && data.città) {
        await geocodeAddress(`${data.indirizzo}, ${data.città}`);
      }
    } catch (err) {
      console.error('Errore:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const geocodeAddress = async (address) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const coords = {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
        setCoordinates(coords);
        calculateNearbyUniversities(coords);
      }
    } catch (error) {
      console.error('Errore geocoding:', error);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const calculateNearbyUniversities = (coords) => {
    const universitiesWithDistance = universities
      .map(uni => ({
        ...uni,
        distance: calculateDistance(coords.lat, coords.lng, uni.lat, uni.lng)
      }))
      .filter(uni => uni.distance <= 100)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 8);

    setNearbyUniversities(universitiesWithDistance);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    setSendingMessage(true);
    try {
      const token = localStorage.getItem('authToken');
      const userData = JSON.parse(localStorage.getItem('userData'));
      
      const response = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          recipientId: announcement.utente_id,
          announcementId: announcement.id,
          content: message,
          senderName: userData.nome || 'Utente'
        })
      });

      if (response.ok) {
        alert('✅ Messaggio inviato con successo!');
        setMessage('');
        setShowMessageModal(false);
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

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '40px',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTop: '4px solid #fff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p>Caricamento dettagli annuncio...</p>
        </div>
      </div>
    );
  }

  if (error || !announcement) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <button 
            onClick={() => navigate('/listings')}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 20px',
              color: 'white',
              cursor: 'pointer',
              marginBottom: '20px'
            }}
          >
            ← Torna alla Lista
          </button>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: '30px',
            textAlign: 'center',
            color: 'white'
          }}>
            <h2>❌ Errore nel caricamento</h2>
            <p>{error || 'Annuncio non trovato'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <button 
          onClick={() => navigate('/listings')}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 20px',
            color: 'white',
            cursor: 'pointer',
            marginBottom: '20px',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
          onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
        >
          ← Torna agli Annunci
        </button>

        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '30px',
          color: 'white',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          
          {/* Titolo e Prezzo */}
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '15px',
            background: 'linear-gradient(135deg, #fff, #e0e7ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {announcement.titolo}
          </h1>
          
          <div style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            padding: '12px 24px',
            borderRadius: '50px',
            display: 'inline-block',
            fontSize: '1.2rem',
            fontWeight: '600',
            marginBottom: '30px'
          }}>
            💰 €{announcement.prezzo}/mese
          </div>

          {/* Sezioni */}
          <div style={{ display: 'grid', gap: '25px' }}>
            
            {/* Informazioni Base */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '20px',
              borderRadius: '15px'
            }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '15px' }}>
                🏠 Informazioni Principali
              </h3>
              <div style={{ display: 'grid', gap: '8px' }}>
                <p><strong>📍 Indirizzo:</strong> {announcement.indirizzo}, {announcement.città}</p>
                <p><strong>📅 Pubblicato:</strong> {new Date(announcement.data_creazione).toLocaleDateString('it-IT')}</p>
                {announcement.tipo_alloggio && (
                  <p><strong>🏡 Tipo:</strong> {announcement.tipo_alloggio}</p>
                )}
                {announcement.numero_stanze && (
                  <p><strong>🚪 Stanze:</strong> {announcement.numero_stanze}</p>
                )}
                {announcement.metri_quadri && (
                  <p><strong>📐 Superficie:</strong> {announcement.metri_quadri} m²</p>
                )}
              </div>
            </div>

            {/* Descrizione */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '20px',
              borderRadius: '15px'
            }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '15px' }}>
                📝 Descrizione
              </h3>
              <p style={{ lineHeight: '1.6' }}>
                {announcement.descrizione || 'Nessuna descrizione disponibile.'}
              </p>
            </div>

            {/* Mappa e Università */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '20px',
              borderRadius: '15px'
            }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '15px' }}>
                🗺️ Posizione e Università Vicine
              </h3>
              
              {/* Mappa */}
              {coordinates ? (
                <div style={{
                  height: '350px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  marginBottom: '20px'
                }}>
                  <iframe
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${coordinates.lng-0.008},${coordinates.lat-0.008},${coordinates.lng+0.008},${coordinates.lat+0.008}&layer=mapnik&marker=${coordinates.lat},${coordinates.lng}`}
                    width="100%"
                    height="100%"
                    style={{ border: 'none' }}
                    title="Mappa posizione alloggio"
                  />
                </div>
              ) : (
                <div style={{
                  height: '200px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}>
                  <p>🗺️ Caricamento mappa in corso...</p>
                </div>
              )}

              {/* Università Vicine */}
              {nearbyUniversities.length > 0 && (
                <div>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '1.1rem' }}>
                    🎓 Università più vicine:
                  </h4>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {nearbyUniversities.map((uni, index) => (
                      <div key={index} style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        padding: '12px 16px',
                        borderRadius: '10px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <strong>{uni.name}</strong>
                          <p style={{ margin: '2px 0 0 0', fontSize: '14px', opacity: 0.8 }}>
                            📍 {uni.city}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <strong style={{ color: '#10b981' }}>
                            {uni.distance.toFixed(1)} km
                          </strong>
                          <p style={{ margin: '2px 0 0 0', fontSize: '12px', opacity: 0.7 }}>
                            🚇 ~{Math.round(uni.distance / 0.5)} min
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Proprietario */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '20px',
              borderRadius: '15px'
            }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '15px' }}>
                👤 Proprietario
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  👤
                </div>
                <div>
                  <p style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 5px 0' }}>
                    {announcement.nome_proprietario || 'alessio andriulo'}
                  </p>
                  <p style={{ opacity: 0.8, margin: 0 }}>
                    📧 @Alessio
                  </p>
                  <p style={{ opacity: 0.8, margin: '5px 0 0 0' }}>
                    📱 333 333 3333
                  </p>
                  <p style={{ opacity: 0.7, margin: '5px 0 0 0', fontSize: '14px' }}>
                    📅 Pubblicato il 24 giugno 2025
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => setShowMessageModal(true)}
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  color: 'white',
                  border: 'none',
                  padding: '15px 30px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  width: '100%',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                💬 Contatta Proprietario
              </button>
              
              <button 
                onClick={() => navigate(-1)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  marginTop: '10px',
                  marginRight: '10px'
                }}
              >
                ← Indietro
              </button>
            </div>
          </div>
        </div>

        {/* Modal Messaggistica */}
        {showMessageModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }} onClick={(e) => {
            if (e.target === e.currentTarget) setShowMessageModal(false);
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '30px',
              maxWidth: '500px',
              width: '100%',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white'
            }}>
              <h3 style={{ marginBottom: '20px' }}>
                💬 Invia Messaggio al Proprietario
              </h3>
              <p style={{ opacity: 0.8, marginBottom: '20px' }}>
                Contatta <strong>{announcement.nome_proprietario || 'il proprietario'}</strong> per l'annuncio "{announcement.titolo}"
              </p>
              <textarea
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '15px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '16px',
                  resize: 'vertical',
                  marginBottom: '20px'
                }}
                placeholder="Scrivi il tuo messaggio qui... (es: Salve, sono interessato al vostro annuncio. Quando posso visionare l'appartamento?)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                <button
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '10px',
                    cursor: 'pointer'
                  }}
                  onClick={() => setShowMessageModal(false)}
                >
                  Annulla
                </button>
                <button
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '10px',
                    cursor: 'pointer'
                  }}
                  onClick={handleSendMessage}
                  disabled={sendingMessage || !message.trim()}
                >
                  {sendingMessage ? 'Invio...' : '📤 Invia Messaggio'}
                </button>
              </div>
            </div>
          </div>
        )}

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          input::placeholder,
          textarea::placeholder {
            color: rgba(255, 255, 255, 0.6);
          }
        `}</style>
      </div>
    </div>
  );
};

export default AnnouncementDetailSimpleMap;
