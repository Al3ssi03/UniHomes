import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const AnnouncementDetailFixed = () => {
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
  const [mapError, setMapError] = useState(false);
  const [geocodingStatus, setGeocodingStatus] = useState('idle'); // idle, loading, success, error

  // Lista università italiane con coordinate precise
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

  // Coordinate di default per le città principali italiane
  const cityCoordinates = {
    'roma': { lat: 41.9028, lng: 12.4964 },
    'milano': { lat: 45.4642, lng: 9.1900 },
    'napoli': { lat: 40.8518, lng: 14.2681 },
    'torino': { lat: 45.0703, lng: 7.6869 },
    'firenze': { lat: 43.7696, lng: 11.2558 },
    'bologna': { lat: 44.4949, lng: 11.3426 },
    'venezia': { lat: 45.4408, lng: 12.3155 },
    'genova': { lat: 44.4056, lng: 8.9463 },
    'palermo': { lat: 38.1157, lng: 13.3613 },
    'bari': { lat: 41.1171, lng: 16.8719 },
    'padova': { lat: 45.4064, lng: 11.8768 },
    'pisa': { lat: 43.7228, lng: 10.4017 }
  };

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
      console.log('📍 Dati annuncio ricevuti:', data);
      setAnnouncement(data);
      
      // Prova il geocoding con fallback
      if (data.città) {
        await geocodeWithFallback(data.indirizzo, data.città);
      } else {
        console.warn('❌ Nessuna città specificata nell\'annuncio');
        setGeocodingStatus('error');
      }
    } catch (err) {
      console.error('❌ Errore caricamento annuncio:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const geocodeWithFallback = async (indirizzo, città) => {
    setGeocodingStatus('loading');
    console.log(`🗺️ Tentativo geocoding per: "${indirizzo}, ${città}"`);
    
    // Prova 1: Geocoding con indirizzo completo
    try {
      const fullAddress = indirizzo ? `${indirizzo}, ${città}` : città;
      const coords = await tryGeocoding(fullAddress);
      if (coords) {
        setCoordinates(coords);
        calculateNearbyUniversities(coords);
        setGeocodingStatus('success');
        console.log('✅ Geocoding riuscito con indirizzo completo:', coords);
        return;
      }
    } catch (error) {
      console.warn('⚠️ Geocoding con indirizzo completo fallito:', error);
    }

    // Prova 2: Geocoding solo con città
    try {
      console.log(`🗺️ Tentativo geocoding solo città: "${città}"`);
      const coords = await tryGeocoding(città);
      if (coords) {
        setCoordinates(coords);
        calculateNearbyUniversities(coords);
        setGeocodingStatus('success');
        console.log('✅ Geocoding riuscito con città:', coords);
        return;
      }
    } catch (error) {
      console.warn('⚠️ Geocoding con città fallito:', error);
    }

    // Prova 3: Coordinate hardcoded per città principali
    const cityKey = città.toLowerCase().trim();
    if (cityCoordinates[cityKey]) {
      const coords = cityCoordinates[cityKey];
      setCoordinates(coords);
      calculateNearbyUniversities(coords);
      setGeocodingStatus('success');
      console.log('✅ Usate coordinate predefinite per', città, ':', coords);
      return;
    }

    // Fallback finale: Coordinate di Roma
    console.warn('⚠️ Tutti i tentativi di geocoding falliti, uso coordinate Roma');
    const fallbackCoords = { lat: 41.9028, lng: 12.4964 };
    setCoordinates(fallbackCoords);
    calculateNearbyUniversities(fallbackCoords);
    setGeocodingStatus('error');
    setMapError(true);
  };

  const tryGeocoding = async (address) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&countrycodes=it`;
    console.log('🌐 URL geocoding:', url);
    
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('📍 Risposta geocoding:', data);
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }
    return null;
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
    console.log('🎓 Calcolo università vicine per coordinate:', coords);
    
    const universitiesWithDistance = universities
      .map(uni => ({
        ...uni,
        distance: calculateDistance(coords.lat, coords.lng, uni.lat, uni.lng)
      }))
      .filter(uni => uni.distance <= 150) // Aumentato il raggio a 150km
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 8);

    console.log('🎓 Università trovate:', universitiesWithDistance.length);
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

  const getMapUrl = () => {
    if (!coordinates) return '';
    const { lat, lng } = coordinates;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}`;
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
                <p><strong>📍 Indirizzo:</strong> {announcement.indirizzo || 'Non specificato'}, {announcement.città}</p>
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
              
              {/* Status geocoding */}
              {geocodingStatus === 'loading' && (
                <div style={{
                  background: 'rgba(255, 193, 7, 0.2)',
                  padding: '10px',
                  borderRadius: '8px',
                  marginBottom: '15px',
                  fontSize: '14px'
                }}>
                  🔍 Ricerca coordinate per: {announcement.indirizzo}, {announcement.città}...
                </div>
              )}

              {mapError && (
                <div style={{
                  background: 'rgba(255, 152, 0, 0.2)',
                  padding: '10px',
                  borderRadius: '8px',
                  marginBottom: '15px',
                  fontSize: '14px'
                }}>
                  ⚠️ Posizione approssimativa (geocoding limitato)
                </div>
              )}
              
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
                    src={getMapUrl()}
                    width="100%"
                    height="100%"
                    style={{ border: 'none' }}
                    title="Mappa posizione alloggio"
                    onLoad={() => console.log('✅ Mappa caricata con successo')}
                    onError={() => console.error('❌ Errore caricamento mappa')}
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
                  marginBottom: '20px',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <p>🗺️ Mappa non disponibile</p>
                  <p style={{ fontSize: '14px', opacity: 0.7 }}>
                    Indirizzo: {announcement.indirizzo || 'Non specificato'}, {announcement.città}
                  </p>
                  <button 
                    onClick={() => geocodeWithFallback(announcement.indirizzo, announcement.città)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      color: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    🔄 Riprova a caricare mappa
                  </button>
                </div>
              )}

              {/* Debug info */}
              {coordinates && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '10px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  marginBottom: '15px'
                }}>
                  📍 Coordinate: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
                  {mapError && <span style={{ color: '#ffa500' }}> (approssimative)</span>}
                </div>
              )}

              {/* Università Vicine */}
              {nearbyUniversities.length > 0 && (
                <div>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '1.1rem' }}>
                    🎓 Università più vicine ({nearbyUniversities.length}):
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
                            🚇 ~{Math.round(uni.distance * 2)} min
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
                    alessio andriulo
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
                Contatta <strong>alessio andriulo</strong> per l'annuncio "{announcement.titolo}"
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

export default AnnouncementDetailFixed;
