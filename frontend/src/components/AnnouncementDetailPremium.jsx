import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { smartGeocode, findNearestUniversities } from '../services/geocoding';

const AnnouncementDetailPremium = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [nearbyUniversities, setNearbyUniversities] = useState([]);
  const [geoStatus, setGeoStatus] = useState('loading');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchAnnouncement();
  }, [id]);

  useEffect(() => {
    if (announcement) {
      performGeocoding();
    }
  }, [announcement]);

  const fetchAnnouncement = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/announcements/${id}`);
      
      if (!response.ok) {
        throw new Error(`Errore ${response.status}: Annuncio non trovato`);
      }
      
      const data = await response.json();
      setAnnouncement(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const performGeocoding = async () => {
    setGeoStatus('loading');
    
    try {
      console.log('🌍 Inizio geocoding avanzato per:', announcement);
      
      const result = await smartGeocode(announcement);
      
      if (result) {
        setCoordinates({ lat: result.lat, lng: result.lng });
        setNearbyUniversities(result.universities);
        setGeoStatus('success');
        console.log('✅ Geocoding completato:', result);
      } else {
        setGeoStatus('error');
        console.log('❌ Geocoding fallito');
      }
    } catch (error) {
      console.error('❌ Errore geocoding:', error);
      setGeoStatus('error');
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    setSendingMessage(true);
    try {
      const token = localStorage.getItem('authToken');
      const userData = JSON.parse(localStorage.getItem('userData'));
      
      if (!token || !userData) {
        alert('❌ Devi essere autenticato per inviare messaggi');
        navigate('/auth');
        return;
      }

      const response = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          recipientId: announcement.userId || announcement.User?.id,
          announcementId: announcement.id,
          content: message.trim(),
          senderName: userData.nome || userData.username
        })
      });

      if (response.ok) {
        alert('✅ Messaggio inviato con successo!');
        setMessage('');
        setShowMessageModal(false);
      } else {
        const errorData = await response.json();
        alert(`❌ Errore: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Errore invio messaggio:', error);
      alert('❌ Errore di connessione');
    } finally {
      setSendingMessage(false);
    }
  };

  const nextImage = () => {
    const images = announcement.immagini || [];
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    const images = announcement.immagini || [];
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    },
    content: {
      maxWidth: '1200px',
      margin: '0 auto',
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
    },
    header: {
      position: 'relative',
      height: '400px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white'
    },
    imageGallery: {
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden'
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    imageNav: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'rgba(0, 0, 0, 0.5)',
      border: 'none',
      borderRadius: '50%',
      width: '50px',
      height: '50px',
      color: 'white',
      fontSize: '20px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease'
    },
    backButton: {
      position: 'absolute',
      top: '20px',
      left: '20px',
      background: 'rgba(255, 255, 255, 0.2)',
      border: 'none',
      borderRadius: '10px',
      color: 'white',
      padding: '10px 20px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      backdropFilter: 'blur(10px)'
    },
    body: {
      padding: '40px',
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '40px'
    },
    mainInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '30px'
    },
    sidebar: {
      display: 'flex',
      flexDirection: 'column',
      gap: '25px'
    },
    section: {
      background: 'white',
      padding: '25px',
      borderRadius: '15px',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
      border: '1px solid rgba(0, 0, 0, 0.05)'
    },
    title: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#2d3748',
      marginBottom: '15px',
      lineHeight: '1.2'
    },
    price: {
      fontSize: '2.5rem',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '10px'
    },
    description: {
      fontSize: '1.1rem',
      lineHeight: '1.6',
      color: '#4a5568',
      marginBottom: '25px'
    },
    infoGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      marginBottom: '25px'
    },
    infoItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '15px',
      background: 'linear-gradient(135deg, #f7fafc, #edf2f7)',
      borderRadius: '10px',
      border: '1px solid rgba(0, 0, 0, 0.05)'
    },
    contactCard: {
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: 'white',
      textAlign: 'center'
    },
    contactButton: {
      width: '100%',
      padding: '15px',
      background: 'rgba(255, 255, 255, 0.2)',
      border: 'none',
      borderRadius: '10px',
      color: 'white',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '15px',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)'
    },
    mapSection: {
      position: 'relative',
      minHeight: '300px'
    },
    map: {
      width: '100%',
      height: '300px',
      borderRadius: '10px',
      border: 'none',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
    },
    universityList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      marginTop: '20px'
    },
    universityItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 15px',
      background: 'linear-gradient(135deg, #f7fafc, #edf2f7)',
      borderRadius: '10px',
      border: '1px solid rgba(0, 0, 0, 0.05)'
    },
    statusBadge: {
      display: 'inline-block',
      padding: '8px 15px',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '15px'
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
      zIndex: 1000
    },
    modalContent: {
      background: 'white',
      borderRadius: '20px',
      padding: '30px',
      maxWidth: '500px',
      width: '90%',
      maxHeight: '80vh',
      overflowY: 'auto'
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '10px',
      fontSize: '16px',
      marginBottom: '15px',
      outline: 'none',
      transition: 'border-color 0.3s ease'
    },
    textarea: {
      width: '100%',
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '10px',
      fontSize: '16px',
      marginBottom: '20px',
      outline: 'none',
      resize: 'vertical',
      minHeight: '120px',
      fontFamily: 'inherit'
    },
    button: {
      padding: '12px 25px',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    buttonSecondary: {
      padding: '12px 25px',
      background: 'transparent',
      color: '#667eea',
      border: '2px solid #667eea',
      borderRadius: '10px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      marginRight: '10px',
      transition: 'all 0.3s ease'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{...styles.content, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh'}}>
          <div style={{textAlign: 'center'}}>
            <div style={{
              width: '60px',
              height: '60px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #667eea',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            <h2>Caricamento annuncio...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={{...styles.content, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh'}}>
          <div style={{textAlign: 'center'}}>
            <h2>❌ Errore</h2>
            <p>{error}</p>
            <button style={styles.button} onClick={() => navigate('/listings')}>
              Torna agli Annunci
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!announcement) return null;

  const images = announcement.immagini || [];
  const hasImages = images.length > 0;

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Header con Immagini */}
        <div style={styles.header}>
          <button 
            style={styles.backButton}
            onClick={() => navigate('/listings')}
          >
            ← Torna agli Annunci
          </button>
          
          {hasImages ? (
            <div style={styles.imageGallery}>
              <img 
                src={`http://localhost:5000${images[currentImageIndex]}`}
                alt={`Immagine ${currentImageIndex + 1}`}
                style={styles.image}
              />
              
              {images.length > 1 && (
                <>
                  <button 
                    style={{...styles.imageNav, left: '20px'}}
                    onClick={prevImage}
                  >
                    ←
                  </button>
                  <button 
                    style={{...styles.imageNav, right: '20px'}}
                    onClick={nextImage}
                  >
                    →
                  </button>
                  
                  <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '8px'
                  }}>
                    {images.map((_, index) => (
                      <div
                        key={index}
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          background: index === currentImageIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                          cursor: 'pointer'
                        }}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '4rem', marginBottom: '20px'}}>🏠</div>
              <h1 style={{margin: 0, fontSize: '2rem'}}>Nessuna Immagine Disponibile</h1>
            </div>
          )}
        </div>

        {/* Corpo */}
        <div style={styles.body}>
          {/* Informazioni Principali */}
          <div style={styles.mainInfo}>
            {/* Titolo e Prezzo */}
            <div style={styles.section}>
              <h1 style={styles.title}>{announcement.titolo}</h1>
              <div style={styles.price}>{formatPrice(announcement.prezzo)}/mese</div>
              
              <div style={styles.infoGrid}>
                <div style={styles.infoItem}>
                  <span style={{fontSize: '20px'}}>📍</span>
                  <div>
                    <strong>Posizione</strong>
                    <div style={{fontSize: '14px', opacity: 0.7}}>
                      {announcement.indirizzo && `${announcement.indirizzo}, `}
                      {announcement.citta}
                      {announcement.provincia && ` (${announcement.provincia})`}
                    </div>
                  </div>
                </div>
                
                <div style={styles.infoItem}>
                  <span style={{fontSize: '20px'}}>📅</span>
                  <div>
                    <strong>Pubblicato</strong>
                    <div style={{fontSize: '14px', opacity: 0.7}}>
                      {new Date(announcement.createdAt).toLocaleDateString('it-IT')}
                    </div>
                  </div>
                </div>
              </div>
              
              {announcement.descrizione && (
                <div style={styles.description}>
                  {announcement.descrizione}
                </div>
              )}
            </div>

            {/* Mappa e Università */}
            <div style={styles.section}>
              <h3 style={{marginBottom: '20px', fontSize: '1.4rem', color: '#2d3748'}}>
                🗺️ Posizione e Università Vicine
              </h3>
              
              {/* Status Geocoding */}
              <div style={{
                ...styles.statusBadge,
                background: geoStatus === 'loading' ? '#ffd700' : 
                          geoStatus === 'success' ? '#00ff88' : '#ff6b6b',
                color: geoStatus === 'loading' ? '#8b7700' : 'white'
              }}>
                {geoStatus === 'loading' && '🔍 Ricerca posizione...'}
                {geoStatus === 'success' && '✅ Posizione trovata'}
                {geoStatus === 'error' && '⚠️ Posizione approssimativa'}
              </div>
              
              {coordinates && (
                <div style={styles.mapSection}>
                  <iframe
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${coordinates.lng-0.01},${coordinates.lat-0.01},${coordinates.lng+0.01},${coordinates.lat+0.01}&layer=mapnik&marker=${coordinates.lat},${coordinates.lng}`}
                    style={styles.map}
                    title="Mappa posizione alloggio"
                  />
                </div>
              )}
              
              {/* Università Vicine */}
              {nearbyUniversities.length > 0 && (
                <div>
                  <h4 style={{margin: '25px 0 15px 0', fontSize: '1.2rem', color: '#2d3748'}}>
                    🎓 Università più vicine ({nearbyUniversities.length})
                  </h4>
                  <div style={styles.universityList}>
                    {nearbyUniversities.map((uni, index) => (
                      <div key={index} style={styles.universityItem}>
                        <div>
                          <strong>{uni.name}</strong>
                          <div style={{fontSize: '14px', opacity: 0.7}}>
                            {uni.city} • {uni.region}
                          </div>
                        </div>
                        <div style={{
                          background: 'linear-gradient(135deg, #667eea, #764ba2)',
                          color: 'white',
                          padding: '5px 12px',
                          borderRadius: '15px',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}>
                          {uni.distance} km
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div style={styles.sidebar}>
            {/* Contatto Proprietario */}
            <div style={{...styles.section, ...styles.contactCard}}>
              <h3 style={{margin: '0 0 15px 0'}}>👤 Contatta il Proprietario</h3>
              
              {announcement.User && (
                <div style={{marginBottom: '20px'}}>
                  <p style={{margin: '5px 0', fontSize: '18px', fontWeight: '600'}}>
                    {announcement.User.nome} {announcement.User.cognome}
                  </p>
                  <p style={{margin: '5px 0', opacity: 0.8}}>
                    @{announcement.User.username}
                  </p>
                  {announcement.User.telefono && (
                    <p style={{margin: '5px 0', opacity: 0.8}}>
                      📱 {announcement.User.telefono}
                    </p>
                  )}
                </div>
              )}
              
              <button 
                style={styles.contactButton}
                onClick={() => setShowMessageModal(true)}
              >
                💬 Invia Messaggio
              </button>
              
              <button 
                style={{
                  ...styles.contactButton, 
                  marginTop: '10px',
                  background: 'linear-gradient(135deg, #00ff88, #00cc66)',
                  fontWeight: 'bold'
                }}
                onClick={() => navigate('/payment', {
                  state: {
                    amount: announcement.prezzo * 0.1, // 10% del prezzo come caparra
                    description: `Caparra per ${announcement.titolo}`,
                    announcementId: announcement.id,
                    customerName: '',
                    customerEmail: ''
                  }
                })}
              >
                💳 Paga Caparra (€{(announcement.prezzo * 0.1).toFixed(2)})
              </button>
              
              {announcement.User?.telefono && (
                <button 
                  style={{...styles.contactButton, marginTop: '10px'}}
                  onClick={() => window.open(`tel:${announcement.User.telefono}`)}
                >
                  📞 Chiama
                </button>
              )}
            </div>

            {/* Informazioni Aggiuntive */}
            <div style={styles.section}>
              <h3 style={{margin: '0 0 15px 0', fontSize: '1.2rem', color: '#2d3748'}}>
                📋 Informazioni
              </h3>
              
              <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span>💰 Prezzo</span>
                  <strong>{formatPrice(announcement.prezzo)}/mese</strong>
                </div>
                
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span>📍 Città</span>
                  <strong>{announcement.citta}</strong>
                </div>
                
                {announcement.provincia && (
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span>🏛️ Provincia</span>
                    <strong>{announcement.provincia}</strong>
                  </div>
                )}
                
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span>📅 Pubblicato</span>
                  <strong>{new Date(announcement.createdAt).toLocaleDateString('it-IT')}</strong>
                </div>
                
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span>🏠 ID Annuncio</span>
                  <strong>#{announcement.id}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Messaggio */}
      {showMessageModal && (
        <div style={styles.modal} onClick={(e) => e.target === e.currentTarget && setShowMessageModal(false)}>
          <div style={styles.modalContent}>
            <h3 style={{margin: '0 0 20px 0', fontSize: '1.4rem', color: '#2d3748'}}>
              💬 Invia Messaggio a {announcement.User?.nome}
            </h3>
            
            <p style={{margin: '0 0 20px 0', color: '#666', fontSize: '14px'}}>
              Il tuo messaggio verrà inviato al proprietario dell'annuncio. 
              Riceverai una risposta nella sezione messaggi.
            </p>
            
            <textarea
              style={styles.textarea}
              placeholder="Scrivi qui il tuo messaggio..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            
            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '10px'}}>
              <button 
                style={styles.buttonSecondary}
                onClick={() => setShowMessageModal(false)}
              >
                Annulla
              </button>
              <button 
                style={{
                  ...styles.button,
                  opacity: sendingMessage || !message.trim() ? 0.5 : 1
                }}
                onClick={handleSendMessage}
                disabled={sendingMessage || !message.trim()}
              >
                {sendingMessage ? '📤 Invio...' : '📤 Invia Messaggio'}
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
      `}</style>
    </div>
  );
};

export default AnnouncementDetailPremium;
