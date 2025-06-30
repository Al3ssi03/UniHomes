import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix per le icone di Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const AnnouncementDetailEnhanced = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [coordinates, setCoordinates] = useState(null);

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
      height: '300px',
      borderRadius: '15px',
      overflow: 'hidden',
      border: '2px solid rgba(255, 255, 255, 0.2)'
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
          geocodeAddress(`${data.indirizzo}, ${data.città}`);
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
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        setCoordinates({
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        });
      }
    } catch (error) {
      console.error('Errore geocoding:', error);
    }
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
          recipientId: announcement.userId || announcement.utente_id,
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

            {/* Mappa Interattiva */}
            {coordinates && (
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>
                  🗺️ Mappa e Università Vicine
                </h3>
                <div style={styles.mapContainer}>
                  <MapContainer
                    center={[coordinates.lat, coordinates.lng]}
                    zoom={15}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[coordinates.lat, coordinates.lng]}>
                      <Popup>
                        <div>
                          <strong>{announcement.titolo}</strong><br />
                          {announcement.indirizzo}<br />
                          €{announcement.prezzo}/mese
                        </div>
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
                <p style={{ marginTop: '15px', opacity: 0.8, fontSize: '14px' }}>
                  📍 Posizione dell'alloggio e distanze dalle università più importanti
                </p>
              </div>
            )}
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

export default AnnouncementDetailEnhanced;
