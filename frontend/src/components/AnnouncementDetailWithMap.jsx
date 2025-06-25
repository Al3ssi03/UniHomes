import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const AnnouncementDetailWithMap = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [nearbyUniversities, setNearbyUniversities] = useState([]);

  // Lista delle principali università italiane con coordinate
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
    { name: "Università di Pisa", lat: 43.7228, lng: 10.4017, city: "Pisa" }
  ];

  // Stili
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px 0'
    },
    content: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px'
    },
    backButton: {
      background: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(10px)',
      border: 'none',
      borderRadius: '12px',
      padding: '12px 20px',
      color: 'white',
      cursor: 'pointer',
      fontSize: '16px',
      marginBottom: '20px',
      transition: 'all 0.3s ease'
    },
    mainCard: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      padding: '30px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      color: 'white',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
    },
    title: {
      fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
      fontWeight: '700',
      marginBottom: '20px',
      background: 'linear-gradient(135deg, #fff, #e0e7ff)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    priceTag: {
      background: 'linear-gradient(135deg, #10b981, #059669)',
      padding: '10px 20px',
      borderRadius: '50px',
      display: 'inline-block',
      fontSize: '1.2rem',
      fontWeight: '600',
      marginBottom: '20px',
      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '30px',
      marginTop: '30px'
    },
    section: {
      background: 'rgba(255, 255, 255, 0.05)',
      padding: '25px',
      borderRadius: '15px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    sectionTitle: {
      fontSize: '1.3rem',
      fontWeight: '600',
      marginBottom: '15px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    contactButton: {
      background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
      color: 'white',
      border: 'none',
      padding: '15px 30px',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
      width: '100%',
      marginTop: '20px'
    },
    mapContainer: {
      height: '400px',
      borderRadius: '15px',
      overflow: 'hidden',
      border: '2px solid rgba(255, 255, 255, 0.2)',
      background: 'rgba(255, 255, 255, 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    },
    mapIframe: {
      width: '100%',
      height: '100%',
      border: 'none',
      borderRadius: '13px'
    },
    universityList: {
      display: 'grid',
      gap: '10px',
      marginTop: '15px'
    },
    universityItem: {
      background: 'rgba(255, 255, 255, 0.1)',
      padding: '12px 16px',
      borderRadius: '10px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    modal: {
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
    },
    modalContent: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      padding: '30px',
      maxWidth: '500px',
      width: '100%',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      color: 'white'
    },
    textarea: {
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
    },
    buttonGroup: {
      display: 'flex',
      gap: '15px',
      justifyContent: 'flex-end'
    },
    button: {
      padding: '12px 24px',
      borderRadius: '10px',
      border: 'none',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    primaryButton: {
      background: 'linear-gradient(135deg, #10b981, #059669)',
      color: 'white'
    },
    secondaryButton: {
      background: 'rgba(255, 255, 255, 0.2)',
      color: 'white'
    }
  };

  useEffect(() => {
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
          throw new Error(`Errore ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setAnnouncement(data);
        
        // Geocoding per ottenere le coordinate
        if (data.indirizzo && data.città) {
          await geocodeAddress(`${data.indirizzo}, ${data.città}`);
        }
      } catch (err) {
        console.error('Errore nel caricamento dell\'annuncio:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAnnouncement();
    }
  }, [id]);

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
        
        // Calcola distanze dalle università
        calculateNearbyUniversities(coords);
      }
    } catch (error) {
      console.error('Errore geocoding:', error);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Raggio della Terra in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  };

  const calculateNearbyUniversities = (coords) => {
    const universitiesWithDistance = universities
      .map(uni => ({
        ...uni,
        distance: calculateDistance(coords.lat, coords.lng, uni.lat, uni.lng)
      }))
      .filter(uni => uni.distance <= 50) // Solo università entro 50km
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5); // Prime 5 più vicine

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

  const generateMapUrl = (coords) => {
    if (!coords) return '';
    return `https://www.openstreetmap.org/export/embed.html?bbox=${coords.lng-0.01},${coords.lat-0.01},${coords.lng+0.01},${coords.lat+0.01}&layer=mapnik&marker=${coords.lat},${coords.lng}`;
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '40px',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.2)'
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
              <p style={{ color: 'white', fontSize: '18px', margin: 0 }}>
                Caricamento dettagli...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <button 
            style={styles.backButton}
            onClick={() => navigate('/listings')}
          >
            ← Torna alla Lista
          </button>
          <div style={styles.mainCard}>
            <h2>❌ Errore nel caricamento</h2>
            <p>{error}</p>
            <button 
              style={styles.contactButton}
              onClick={() => window.location.reload()}
            >
              🔄 Riprova
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!announcement) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <button 
            style={styles.backButton}
            onClick={() => navigate('/listings')}
          >
            ← Torna alla Lista
          </button>
          <div style={styles.mainCard}>
            <h2>❌ Annuncio non trovato</h2>
            <p>L'annuncio richiesto non esiste o è stato rimosso.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <button 
          style={styles.backButton}
          onClick={() => navigate('/listings')}
          onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
          onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
        >
          ← Torna agli Annunci
        </button>

        <div style={styles.mainCard}>
          <h1 style={styles.title}>{announcement.titolo}</h1>
          
          <div style={styles.priceTag}>
            💰 €{announcement.prezzo}/mese
          </div>

          <div style={styles.grid}>
            {/* Informazioni Base */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>
                🏠 Informazioni Principali
              </h3>
              <div style={{ display: 'grid', gap: '10px' }}>
                <p><strong>📍 Posizione:</strong> {announcement.indirizzo}, {announcement.città}</p>
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
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>
                📝 Descrizione
              </h3>
              <p style={{ lineHeight: '1.6', fontSize: '16px' }}>
                {announcement.descrizione || 'Nessuna descrizione disponibile.'}
              </p>
            </div>

            {/* Proprietario */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>
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
                    {announcement.nome_proprietario || 'Proprietario'}
                  </p>
                  <p style={{ opacity: 0.8, margin: 0 }}>
                    📧 {announcement.email_proprietario || 'Email non disponibile'}
                  </p>
                  {announcement.telefono_proprietario && (
                    <p style={{ opacity: 0.8, margin: '5px 0 0 0' }}>
                      📱 {announcement.telefono_proprietario}
                    </p>
                  )}
                </div>
              </div>
              
              <button 
                style={styles.contactButton}
                onClick={() => setShowMessageModal(true)}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                💬 Contatta Proprietario
              </button>
            </div>

            {/* Mappa e Università */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>
                🗺️ Mappa e Università Vicine
              </h3>
              
              {/* Mappa */}
              <div style={styles.mapContainer}>
                {coordinates ? (
                  <iframe
                    src={generateMapUrl(coordinates)}
                    style={styles.mapIframe}
                    title="Mappa della posizione"
                    loading="lazy"
                  />
                ) : (
                  <div style={{ textAlign: 'center', color: 'white' }}>
                    <p>🗺️ Caricamento mappa...</p>
                    <p style={{ fontSize: '14px', opacity: 0.7 }}>
                      Indirizzo: {announcement.indirizzo}, {announcement.città}
                    </p>
                  </div>
                )}
              </div>

              {/* Università Vicine */}
              {nearbyUniversities.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                  <h4 style={{ margin: '0 0 15px 0', fontSize: '1.1rem' }}>
                    🎓 Università più vicine:
                  </h4>
                  <div style={styles.universityList}>
                    {nearbyUniversities.map((uni, index) => (
                      <div key={index} style={styles.universityItem}>
                        <div>
                          <strong>{uni.name}</strong>
                          <p style={{ margin: '2px 0 0 0', fontSize: '14px', opacity: 0.8 }}>
                            {uni.city}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <strong>{uni.distance.toFixed(1)} km</strong>
                          <p style={{ margin: '2px 0 0 0', fontSize: '12px', opacity: 0.7 }}>
                            ~ {Math.round(uni.distance * 60 / 5)} min in metro
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {coordinates && (
                <p style={{ marginTop: '15px', opacity: 0.8, fontSize: '14px' }}>
                  📍 Coordinate: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Modal Messaggistica */}
        {showMessageModal && (
          <div style={styles.modal} onClick={(e) => {
            if (e.target === e.currentTarget) setShowMessageModal(false);
          }}>
            <div style={styles.modalContent}>
              <h3 style={{ marginBottom: '20px' }}>
                💬 Invia Messaggio al Proprietario
              </h3>
              <p style={{ opacity: 0.8, marginBottom: '20px' }}>
                Contatta <strong>{announcement.nome_proprietario || 'il proprietario'}</strong> per l'annuncio "{announcement.titolo}"
              </p>
              <textarea
                style={styles.textarea}
                placeholder="Scrivi il tuo messaggio qui... (es: Salve, sono interessato al vostro annuncio. Quando posso visionare l'appartamento?)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <div style={styles.buttonGroup}>
                <button
                  style={{...styles.button, ...styles.secondaryButton}}
                  onClick={() => setShowMessageModal(false)}
                >
                  Annulla
                </button>
                <button
                  style={{...styles.button, ...styles.primaryButton}}
                  onClick={handleSendMessage}
                  disabled={sendingMessage || !message.trim()}
                >
                  {sendingMessage ? 'Invio...' : '📤 Invia Messaggio'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CSS per animazioni */}
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

export default AnnouncementDetailWithMap;
