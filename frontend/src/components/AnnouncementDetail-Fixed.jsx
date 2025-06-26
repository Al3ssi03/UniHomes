import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LocationMap from './LocationMap';

const AnnouncementDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/announcements/${id}`);
        
        if (!response.ok) {
          throw new Error(`Errore ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setAnnouncement(data);
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

  const nextImage = () => {
    if (announcement?.immagini?.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === announcement.immagini.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (announcement?.immagini?.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? announcement.immagini.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
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
    );
  }

  if (error) {
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
          border: '1px solid rgba(255, 255, 255, 0.2)',
          maxWidth: '500px'
        }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>😔</div>
          <h2 style={{ color: 'white', marginBottom: '15px' }}>Errore</h2>
          <p style={{ color: 'white', marginBottom: '30px' }}>{error}</p>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'linear-gradient(45deg, #ff6b9d, #ff9a56)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Torna alla Home
          </button>
        </div>
      </div>
    );
  }

  if (!announcement) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '40px',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>🏠</div>
          <h2 style={{ color: 'white', marginBottom: '15px' }}>Annuncio non trovato</h2>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'linear-gradient(45deg, #ff6b9d, #ff9a56)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Torna alla Home
          </button>
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
      {/* Header con bottone indietro */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        marginBottom: '30px'
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '15px',
            padding: '12px 20px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          <span style={{ fontSize: '20px' }}>←</span>
          <span>Torna agli Annunci</span>
        </button>
      </div>

      {/* Card principale */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr',
          gap: '0'
        }}>
          
          {/* Galleria Immagini */}
          <div style={{ position: 'relative' }}>
            {announcement.immagini && announcement.immagini.length > 0 ? (
              <div style={{ position: 'relative', height: window.innerWidth > 768 ? 'auto' : '300px', minHeight: '400px' }}>
                <img
                  src={`http://localhost:5000${announcement.immagini[currentImageIndex]}`}
                  alt={announcement.titolo}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.style.background = 'linear-gradient(45deg, #ff9a56, #ff6b9d)';
                    e.target.parentElement.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: white; font-size: 60px;">🏠</div>';
                  }}
                />
                
                {/* Controlli navigazione immagini */}
                {announcement.immagini.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      style={{
                        position: 'absolute',
                        left: '20px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'rgba(0, 0, 0, 0.5)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '50px',
                        height: '50px',
                        cursor: 'pointer',
                        fontSize: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.7)'}
                      onMouseOut={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.5)'}
                    >
                      ←
                    </button>
                    <button
                      onClick={nextImage}
                      style={{
                        position: 'absolute',
                        right: '20px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'rgba(0, 0, 0, 0.5)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '50px',
                        height: '50px',
                        cursor: 'pointer',
                        fontSize: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.7)'}
                      onMouseOut={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.5)'}
                    >
                      →
                    </button>
                  </>
                )}
                
                {/* Indicatori immagini */}
                {announcement.immagini.length > 1 && (
                  <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '8px'
                  }}>
                    {announcement.immagini.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          border: 'none',
                          background: index === currentImageIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                height: '400px',
                background: 'linear-gradient(45deg, #ff9a56, #ff6b9d)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '80px'
              }}>
                🏠
              </div>
            )}
          </div>

          {/* Dettagli Annuncio */}
          <div style={{ padding: '40px' }}>
            {/* Titolo e Prezzo */}
            <div style={{ marginBottom: '30px' }}>
              <h1 style={{
                color: 'white',
                fontSize: '28px',
                fontWeight: 'bold',
                marginBottom: '10px',
                lineHeight: '1.2'
              }}>
                {announcement.titolo}
              </h1>
              <div style={{
                background: 'linear-gradient(45deg, #ff6b9d, #ff9a56)',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '25px',
                display: 'inline-block',
                fontSize: '24px',
                fontWeight: 'bold'
              }}>
                €{announcement.prezzo}/mese
              </div>
            </div>

            {/* Caratteristiche principali */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '15px',
              marginBottom: '30px'
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '15px',
                borderRadius: '15px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{ fontSize: '24px', marginBottom: '5px' }}>🛏️</div>
                <div style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>
                  {announcement.tipo_stanza}
                </div>
              </div>
              
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '15px',
                borderRadius: '15px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{ fontSize: '24px', marginBottom: '5px' }}>📍</div>
                <div style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>
                  {announcement.citta}
                </div>
              </div>
              
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '15px',
                borderRadius: '15px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{ fontSize: '24px', marginBottom: '5px' }}>📏</div>
                <div style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>
                  {announcement.dimensione || 'N/A'} m²
                </div>
              </div>
            </div>

            {/* Descrizione */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{
                color: 'white',
                fontSize: '20px',
                marginBottom: '15px',
                fontWeight: 'bold'
              }}>
                Descrizione
              </h3>
              <p style={{
                color: 'rgba(255, 255, 255, 0.9)',
                lineHeight: '1.6',
                fontSize: '16px'
              }}>
                {announcement.descrizione || 'Nessuna descrizione disponibile.'}
              </p>
            </div>            {/* Indirizzo */}
            {announcement.indirizzo && (
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{
                  color: 'white',
                  fontSize: '20px',
                  marginBottom: '10px',
                  fontWeight: 'bold'
                }}>
                  📍 Indirizzo
                </h3>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '16px',
                  lineHeight: '1.5'
                }}>
                  <strong>{announcement.indirizzo}</strong><br/>
                  {announcement.citta}{announcement.provincia ? ` (${announcement.provincia})` : ''}, Italia
                </p>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  marginTop: '10px',
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.8)'
                }}>
                  🎯 Indirizzo ricercato: {announcement.indirizzo}, {announcement.citta}, {announcement.provincia}, Italia
                </div>
              </div>
            )}

            {/* Bottone Contatta */}
            <div style={{ marginBottom: '30px' }}>
              <button
                onClick={() => setShowContact(!showContact)}
                style={{
                  background: 'linear-gradient(45deg, #4facfe, #00f2fe)',
                  color: 'white',
                  border: 'none',
                  padding: '15px 30px',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  width: '100%',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {showContact ? '📱 Nascondi Contatti' : '📞 Contatta Proprietario'}
              </button>
            </div>

            {/* Informazioni di contatto */}
            {showContact && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '20px',
                borderRadius: '15px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                marginBottom: '30px'
              }}>
                <h4 style={{
                  color: 'white',
                  marginBottom: '15px',
                  fontSize: '18px',
                  fontWeight: 'bold'
                }}>
                  Informazioni di Contatto
                </h4>
                {announcement.telefono && (
                  <div style={{ marginBottom: '10px' }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>📱 Telefono: </span>
                    <span style={{ color: 'white', fontWeight: 'bold' }}>{announcement.telefono}</span>
                  </div>
                )}
                {announcement.email && (
                  <div style={{ marginBottom: '10px' }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>✉️ Email: </span>
                    <span style={{ color: 'white', fontWeight: 'bold' }}>{announcement.email}</span>
                  </div>
                )}
                {!announcement.telefono && !announcement.email && (
                  <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontStyle: 'italic' }}>
                    Nessuna informazione di contatto disponibile.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mappa */}
        {announcement.indirizzo && (
          <div style={{ padding: '40px', paddingTop: '0' }}>
            <h3 style={{
              color: 'white',
              fontSize: '24px',
              marginBottom: '20px',
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              🗺️ Posizione e Università Vicine
            </h3>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '20px',
              borderRadius: '15px',
              border: '1px solid rgba(255, 255, 255, 0.2)'            }}>              {/* DEBUG INFO */}
              <div style={{
                background: 'rgba(255, 255, 0, 0.1)',
                padding: '10px',
                borderRadius: '5px',
                marginBottom: '10px',
                fontSize: '12px',
                fontFamily: 'monospace',
                color: 'white'
              }}>
                <strong>🐛 DEBUG MAPPA:</strong><br/>
                Indirizzo originale: {announcement.indirizzo || 'N/A'}<br/>
                Città: {announcement.citta || 'N/A'}<br/>
                Provincia: {announcement.provincia || 'N/A'}<br/>
                <strong>Indirizzo ricercato:</strong> {`${announcement.indirizzo}, ${announcement.citta}, ${announcement.provincia}, Italia`}<br/>
                <em>Il sistema proverà anche varianti come "Via Brunelleschi, Oria, Brindisi, Italia"</em>
              </div>
              <LocationMap 
                cityName={announcement.citta}
                address={announcement.indirizzo}                province={announcement.provincia}
                fullAddress={`${announcement.indirizzo}, ${announcement.citta}, ${announcement.provincia}, Italia`}
              />
            </div>
          </div>
        )}
      </div>

      {/* Stile per l'animazione di caricamento */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default AnnouncementDetail;
