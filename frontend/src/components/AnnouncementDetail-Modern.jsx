import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LocationMap from './LocationMap';

// Tema moderno identico a quello dell'app principale
const theme = {
  colors: {
    primary: '#667eea',
    primaryDark: '#5a67d8',
    secondary: '#f093fb',
    accent: '#4facfe',
    
    success: '#48bb78',
    warning: '#ed8936',
    error: '#f56565',
    info: '#4299e1',
    
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    backgroundAlt: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #a8edea 100%)',
    backgroundCard: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    backgroundHero: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 50%, #a8edea 100%)',
    backgroundPurple: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backgroundPink: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    backgroundBlue: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    backgroundOrange: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    
    surface: 'rgba(255, 255, 255, 0.98)',
    surfaceGlass: 'rgba(255, 255, 255, 0.15)',
    surfaceDark: 'rgba(0, 0, 0, 0.8)',
    surfaceBlur: 'rgba(255, 255, 255, 0.25)',
    
    text: '#1a1a1a',
    textLight: '#6b7280',
    textOnDark: '#ffffff',
    white: '#ffffff'
  },
  
  shadows: {
    sm: '0 2px 4px rgba(0, 0, 0, 0.1)',
    md: '0 4px 12px rgba(0, 0, 0, 0.15)',
    lg: '0 8px 25px rgba(0, 0, 0, 0.15)',
    xl: '0 20px 40px rgba(0, 0, 0, 0.2)',
    glow: '0 0 40px rgba(102, 126, 234, 0.4)',
    colorful: '0 8px 32px rgba(240, 147, 251, 0.4)',
    rainbow: '0 8px 32px rgba(102, 126, 234, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
    neon: '0 0 20px rgba(240, 147, 251, 0.6), 0 0 40px rgba(102, 126, 234, 0.4)'
  },
  
  transitions: {
    fast: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    normal: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    slow: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    elastic: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  },
  
  borderRadius: {
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    full: '50px'
  }
};

// Stili per il componente
const styles = {
  container: {
    minHeight: '100vh',
    background: theme.colors.background,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif',
    color: theme.colors.textOnDark,
    position: 'relative',
    padding: '32px 16px'
  },
  
  backgroundPattern: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `
      radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(120, 119, 255, 0.2) 0%, transparent 50%)
    `,
    zIndex: -1,
    animation: 'backgroundMove 20s ease-in-out infinite'
  },
  
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 1
  },
  
  backButton: {
    background: 'rgba(255, 255, 255, 0.1)',
    color: theme.colors.white,
    border: '2px solid rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(10px)',
    padding: '12px 24px',
    borderRadius: theme.borderRadius.full,
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: theme.transitions.bounce,
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '32px'
  },
  
  mainCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    boxShadow: theme.shadows.rainbow,
    border: '1px solid rgba(255, 255, 255, 0.3)',
    color: theme.colors.text
  },
  
  header: {
    padding: '40px',
    background: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 50%, #a8edea 100%)',
    color: theme.colors.white,
    textAlign: 'center'
  },
  
  title: {
    fontSize: '36px',
    fontWeight: '800',
    marginBottom: '16px',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
  },
  
  priceTag: {
    background: 'rgba(255, 255, 255, 0.2)',
    color: theme.colors.white,
    padding: '12px 24px',
    borderRadius: theme.borderRadius.full,
    fontSize: '24px',
    fontWeight: '700',
    display: 'inline-block',
    backdropFilter: 'blur(10px)',
    border: '2px solid rgba(255, 255, 255, 0.3)'
  },
  
  location: {
    fontSize: '18px',
    marginTop: '16px',
    opacity: 0.9
  },
  
  mainContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px',
    padding: '40px'
  },
  
  imageSection: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    boxShadow: theme.shadows.lg,
    background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    height: '400px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  placeholderImage: {
    fontSize: '80px',
    opacity: 0.7
  },
  
  infoSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  
  section: {
    background: 'rgba(255, 255, 255, 0.5)',
    padding: '24px',
    borderRadius: theme.borderRadius.md,
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)'
  },
  
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    marginBottom: '12px',
    color: theme.colors.text,
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  
  badge: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: theme.colors.white,
    padding: '8px 16px',
    borderRadius: theme.borderRadius.full,
    fontSize: '14px',
    fontWeight: '600',
    display: 'inline-block',
    marginRight: '8px',
    marginBottom: '8px'
  },
  
  button: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: theme.colors.white,
    border: 'none',
    padding: '16px 32px',
    borderRadius: theme.borderRadius.full,
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: theme.transitions.elastic,
    boxShadow: theme.shadows.rainbow,
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    justifyContent: 'center',
    width: '100%'
  },
  
  buttonSecondary: {
    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    color: theme.colors.text
  },
  
  buttonWarning: {
    background: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
    color: theme.colors.white
  },
  
  ownerCard: {
    background: 'linear-gradient(135deg, rgba(168, 237, 234, 0.2) 0%, rgba(254, 214, 227, 0.2) 100%)',
    padding: '24px',
    borderRadius: theme.borderRadius.lg,
    marginTop: '24px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(10px)'
  },
  
  mapSection: {
    gridColumn: '1 / -1',
    background: 'rgba(255, 255, 255, 0.9)',
    padding: '32px',
    borderRadius: theme.borderRadius.lg,
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: theme.shadows.lg
  },
  
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: theme.colors.background,
    color: theme.colors.white
  },
  
  loadingSpinner: {
    fontSize: '64px',
    animation: 'pulse 2s infinite',
    marginBottom: '24px'
  },
  
  error: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: theme.colors.background,
    color: theme.colors.white,
    textAlign: 'center',
    padding: '32px'
  },
  
  animations: `
    @keyframes backgroundMove {
      0%, 100% { 
        transform: translateY(0px) rotate(0deg) scale(1); 
        filter: hue-rotate(0deg);
      }
      25% { 
        transform: translateY(-15px) rotate(0.5deg) scale(1.02); 
        filter: hue-rotate(10deg);
      }
      50% { 
        transform: translateY(-25px) rotate(1deg) scale(1.05); 
        filter: hue-rotate(20deg);
      }
      75% { 
        transform: translateY(-15px) rotate(0.5deg) scale(1.02); 
        filter: hue-rotate(10deg);
      }
    }
    
    @keyframes pulse {
      0%, 100% { 
        transform: scale(1); 
        opacity: 1;
      }
      50% { 
        transform: scale(1.1); 
        opacity: 0.8;
      }
    }
    
    @media (max-width: 768px) {
      .responsive-grid {
        grid-template-columns: 1fr !important;
      }
    }
  `
};

// Funzione toast migliorata
const showToast = (message, type = 'info') => {
  const emoji = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };
  
  alert(`${emoji[type]} ${message}`);
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
      showToast('Devi effettuare il login per contattare i proprietari', 'warning');
      navigate('/auth');
      return;
    }

    try {
      // Simuliamo l'invio di un messaggio al proprietario
      // Dato che non abbiamo un sistema di messaggi completo, mostriamo un contatto diretto
      const ownerContact = announcement.proprietario_email || announcement.email || 'info@unihome.com';
      const phoneNumber = announcement.telefono || '333 333 3333';
      
      // Mostra le informazioni di contatto in un alert più professionale
      const contactInfo = `
🏠 Proprietario: ${announcement.proprietario_nome || 'alessio andriulo'}
📧 Email: ${ownerContact}
📱 Telefono: ${phoneNumber}
      
Puoi contattare direttamente il proprietario usando questi recapiti!`;
      
      showToast(contactInfo, 'info');
      
      // Alternativa: apri l'email client
      // window.location.href = `mailto:${ownerContact}?subject=Interesse per ${announcement.titolo}&body=Ciao, sono interessato al tuo annuncio "${announcement.titolo}". Puoi darmi maggiori informazioni?`;
      
    } catch (error) {
      console.error('Errore contatto proprietario:', error);
      showToast('Errore nel recupero dei contatti', 'error');
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
      <div style={styles.loading}>
        <div style={styles.backgroundPattern}></div>
        <div style={styles.loadingSpinner}>🏠</div>
        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
          Caricamento annuncio...
        </h2>
        <p style={{ fontSize: '16px', opacity: 0.8 }}>
          Preparazione dei dettagli
        </p>
        <style dangerouslySetInnerHTML={{ __html: styles.animations }} />
      </div>
    );
  }

  if (error || !announcement) {
    return (
      <div style={styles.error}>
        <div style={styles.backgroundPattern}></div>
        <div style={{ fontSize: '80px', marginBottom: '24px' }}>😞</div>
        <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '16px' }}>
          Annuncio non trovato
        </h1>
        <p style={{ fontSize: '18px', marginBottom: '32px', opacity: 0.9 }}>
          {error || 'L\'annuncio che stai cercando non esiste'}
        </p>
        <button
          style={{
            ...styles.button,
            ...styles.buttonWarning,
            maxWidth: '300px'
          }}
          onClick={() => navigate('/listings')}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-3px) scale(1.05)';
            e.target.style.boxShadow = '0 15px 35px rgba(255, 154, 158, 0.6)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0) scale(1)';
            e.target.style.boxShadow = styles.button.boxShadow;
          }}
        >
          ← Torna agli Annunci
        </button>
        <style dangerouslySetInnerHTML={{ __html: styles.animations }} />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.backgroundPattern}></div>
      
      <div style={styles.content}>
        {/* Pulsante Indietro */}
        <button
          style={styles.backButton}
          onClick={() => navigate('/listings')}
          onMouseOver={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          ← Torna agli Annunci
        </button>

        {/* Card Principale */}
        <div style={styles.mainCard}>
          {/* Header */}
          <div style={styles.header}>
            <h1 style={styles.title}>
              {announcement.titolo}
            </h1>
            <div style={styles.priceTag}>
              €{announcement.prezzo}/mese
            </div>
            <div style={styles.location}>
              📍 {announcement.citta}, {announcement.indirizzo}
            </div>
          </div>

          {/* Contenuto Principale */}
          <div style={{
            ...styles.mainContent,
            display: 'grid',
            gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : '1fr 1fr'
          }} className="responsive-grid">
            
            {/* Sezione Immagine */}
            <div style={styles.imageSection}>
              <div style={styles.placeholderImage}>🏠</div>
            </div>

            {/* Sezione Informazioni */}
            <div style={styles.infoSection}>
              
              {/* Descrizione */}
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>
                  📝 Descrizione
                </h3>
                <p style={{ 
                  lineHeight: '1.6', 
                  color: theme.colors.text,
                  fontSize: '16px'
                }}>
                  {announcement.descrizione || 'Nessuna descrizione disponibile.'}
                </p>
              </div>

              {/* Dettagli Proprietà */}
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>
                  🏡 Dettagli Alloggio
                </h3>
                <div>
                  <span style={styles.badge}>
                    🛏️ {announcement.tipo_alloggio || 'Non specificato'}
                  </span>
                  <span style={styles.badge}>
                    👥 {announcement.posti_letto || 0} posti letto
                  </span>
                  {announcement.bagni && (
                    <span style={styles.badge}>
                      🚿 {announcement.bagni} bagni
                    </span>
                  )}
                  {announcement.cucina && (
                    <span style={styles.badge}>
                      🍳 Cucina
                    </span>
                  )}
                </div>
              </div>

              {/* Pulsante Contatto */}
              <button
                style={{
                  ...styles.button,
                  background: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)'
                }}
                onClick={handleContact}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-3px) scale(1.05)';
                  e.target.style.boxShadow = '0 15px 35px rgba(255, 154, 158, 0.6)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = styles.button.boxShadow;
                }}
              >
                📞 Contatta Proprietario
              </button>

            </div>
          </div>

          {/* Informazioni Proprietario */}
          <div style={{
            ...styles.ownerCard,
            margin: '0 40px 24px 40px'
          }}>
            <h3 style={{
              ...styles.sectionTitle,
              color: theme.colors.text,
              marginBottom: '16px'
            }}>
              👤 Proprietario
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <strong style={{ color: theme.colors.text }}>Nome:</strong><br />
                <span style={{ color: theme.colors.textLight }}>
                  {announcement.proprietario_nome || 'alessio andriulo'}
                </span>
              </div>
              <div>
                <strong style={{ color: theme.colors.text }}>Email:</strong><br />
                <span style={{ color: theme.colors.textLight }}>
                  {announcement.proprietario_email || '@Alessio'}
                </span>
              </div>
              <div>
                <strong style={{ color: theme.colors.text }}>Telefono:</strong><br />
                <span style={{ color: theme.colors.textLight }}>
                  📱 {announcement.telefono || '333 333 3333'}
                </span>
              </div>
              <div>
                <strong style={{ color: theme.colors.text }}>Pubblicato:</strong><br />
                <span style={{ color: theme.colors.textLight }}>
                  📅 {formatDate(announcement.created_at || new Date().toISOString())}
                </span>
              </div>
            </div>
          </div>

          {/* Sezione Mappa */}
          <div style={{
            ...styles.mapSection,
            margin: '0 40px 40px 40px'
          }}>
            <h3 style={{
              ...styles.sectionTitle,
              color: theme.colors.text,
              marginBottom: '24px'
            }}>
              🗺️ Mappa e Università Vicine
            </h3>
            
            <div style={{
              color: theme.colors.textLight,
              marginBottom: '20px',
              fontSize: '16px'
            }}>
              Posizione dell'alloggio e distanze dalle università più importanti
            </div>              {/* LocationMap Component */}
              <div style={{
                borderRadius: theme.borderRadius.md,
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                padding: '20px',
                minHeight: '400px'
              }}>
                <LocationMap 
                  cityName={announcement.citta}
                  address={announcement.indirizzo}
                />
              </div>
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: styles.animations }} />
    </div>
  );
};

export default AnnouncementDetail;
