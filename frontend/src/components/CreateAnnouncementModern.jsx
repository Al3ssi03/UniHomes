import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// TOAST INTERNO - NESSUNA DIPENDENZA ESTERNA
const showToast = (message, type = 'info') => {
  // Crea toast semplice usando alert per ora
  if (type === 'success') {
    alert(`✅ ${message}`);
  } else if (type === 'error') {
    alert(`❌ ${message}`);
  } else {
    alert(`ℹ️ ${message}`);
  }
};

const CreateAnnouncementModern = () => {
  const navigate = useNavigate();
    // STATE SEMPLIFICATO - SOLO VALORI STRINGA
  const [fields, setFields] = useState({
    titolo: '',
    descrizione: '',
    prezzo: '',
    citta: '',
    indirizzo: ''
  });
  
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // GESTORE INPUT UNIFICATO - GARANTISCE SEMPRE STRINGHE
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`🔥 DIRECT INPUT: ${name} = "${value}"`);
    
    setFields(prev => {
      const updated = {
        ...prev,
        [name]: String(value || '') // FORZA SEMPRE STRINGA
      };
      console.log(`🔥 UPDATED FIELDS:`, updated);
      return updated;
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setError('Puoi caricare massimo 5 immagini');
      return;
    }
    setImages(files);
    setError(''); // Rimuovi errori precedenti
  };

  // SUBMIT ROBUSTO CON DEBUG
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    // EMERGENCY FIELD COLLECTION - RACCOGLI DATI DIRETTAMENTE DAL DOM
    const form = e.target;
    const formData = new FormData(form);
    
    // ESTRAI VALORI SPECIFICI DAL FORM
    const directValues = {      titolo: form.titolo.value,
      descrizione: form.descrizione.value,
      prezzo: form.prezzo.value,
      citta: form.citta.value,
      indirizzo: form.indirizzo.value || ''
    };
    
    console.log('🚨 FINAL DEBUG - Direct DOM values:', directValues);
    console.log('🚨 FINAL DEBUG - React state:', fields);
    
    // VALIDAZIONE ROBUSTA
    if (!directValues.titolo || !directValues.prezzo || !directValues.citta) {
      setError('Titolo, prezzo e città sono campi obbligatori');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Devi essere autenticato per creare un annuncio');
        navigate('/auth');
        return;
      }

      // COSTRUISCI FORM DATA FINALE
      const submitData = new FormData();
        // USA I VALORI PIÙ SICURI (dal DOM)
      submitData.append('titolo', directValues.titolo);
      submitData.append('descrizione', directValues.descrizione);
      submitData.append('prezzo', directValues.prezzo);
      submitData.append('citta', directValues.citta);
      submitData.append('indirizzo', directValues.indirizzo);
      
      // DEBUG: Verifica finale FormData
      console.log('✅ SUBMIT DATA:');
      for (let [key, value] of submitData.entries()) {
        console.log(`  "${key}": "${value}"`);
      }

      // Aggiungi le immagini
      images.forEach(image => {
        submitData.append('immagini', image);
      });

      const response = await fetch('http://localhost:5000/api/announcements', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitData
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Annuncio creato con successo!');
        showToast('Annuncio creato con successo!', 'success');
        setTimeout(() => {
          navigate('/listings');
        }, 1500);
      } else {
        console.log('❌ SERVER RESPONSE ERROR:', data);
        setError(data.message || 'Errore durante la creazione dell\'annuncio');
        showToast(data.message || 'Errore durante la creazione dell\'annuncio', 'error');
      }
    } catch (error) {
      console.error('❌ NETWORK ERROR:', error);
      setError('Errore di connessione al server');
      showToast('Errore di connessione al server', 'error');
    } finally {
      setLoading(false);
    }
  };
  // Verifica autenticazione
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/auth');
    }
  }, [navigate]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
      padding: '2rem 1rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Animated Background Particles */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        background: `
          radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 1px, transparent 1px),
          radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 1px, transparent 1px),
          radial-gradient(circle at 40% 60%, rgba(255,255,255,0.05) 1px, transparent 1px)
        `,
        backgroundSize: '100px 100px, 80px 80px, 120px 120px',
        animation: 'float 20s ease-in-out infinite'
      }}>
      </div>

      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 10
      }}>
        
        {/* Header Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem',
          color: 'white'
        }}>          <div style={{
            fontSize: '4rem',
            marginBottom: '1.5rem',
            animation: 'bounce 2s ease-in-out infinite'
          }}>🏠</div>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '800',
            margin: '0 0 1.5rem 0',
            textShadow: '0 4px 8px rgba(0,0,0,0.3)',
            background: 'linear-gradient(45deg, #fff, #f0f8ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            ✨ Pubblica il tuo Annuncio
          </h1>
          <p style={{
            fontSize: '1.3rem',
            opacity: 0.95,
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: '1.7',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>
            🎯 Connetti con migliaia di studenti e lavoratori in tutta Italia.
            Il tuo spazio merita di essere scoperto! 🌟
          </p>
        </div>

        {/* Main Form Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '3rem',
          boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
          border: '1px solid rgba(255,255,255,0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          
          {/* Card Background Pattern */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '200px',
            height: '200px',
            background: 'linear-gradient(45deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1))',
            borderRadius: '50%',
            transform: 'translate(50%, -50%)',
            pointerEvents: 'none'
          }}></div>

          <style>{`
            @keyframes float {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              33% { transform: translateY(-10px) rotate(1deg); }
              66% { transform: translateY(5px) rotate(-1deg); }
            }
            @keyframes bounce {
              0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
              40% { transform: translateY(-10px); }
              60% { transform: translateY(-5px); }
            }
            @keyframes shimmer {
              0% { background-position: -200px 0; }
              100% { background-position: 200px 0; }
            }
            .gradient-border {
              background: linear-gradient(45deg, #667eea, #764ba2, #667eea);
              background-size: 200% 200%;
              animation: shimmer 3s ease-in-out infinite;
            }
            .glass-input {
              background: rgba(255,255,255,0.9);
              border: 2px solid rgba(102,126,234,0.2);
              transition: all 0.3s ease;
              border-radius: 12px;
              padding: 16px 20px;
              font-size: 16px;
              width: 100%;
              outline: none;
            }
            .glass-input:focus {
              background: rgba(255,255,255,1);
              border-color: #667eea;
              box-shadow: 0 0 0 4px rgba(102,126,234,0.1);
              transform: translateY(-2px);
            }
            .glass-button {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              transition: all 0.3s ease;
              border: none;
              border-radius: 16px;
              padding: 18px 32px;
              color: white;
              font-weight: 600;
              font-size: 18px;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              min-height: 56px;
            }
            .glass-button:hover:not(:disabled) {
              transform: translateY(-3px);
              box-shadow: 0 10px 25px rgba(102,126,234,0.4);
            }
            .glass-button:disabled {
              opacity: 0.7;
              transform: none;
              cursor: not-allowed;
            }
            .field-group {
              margin-bottom: 2rem;
              position: relative;
            }
            .field-label {
              display: block;
              margin-bottom: 8px;
              font-weight: 600;
              color: #374151;
              font-size: 16px;
            }
            .error-message {
              background: #fee2e2;
              border: 2px solid #fca5a5;
              color: #dc2626;
              padding: 16px;
              border-radius: 12px;
              margin-bottom: 24px;
              font-weight: 500;
            }
            .success-message {
              background: #d1fae5;
              border: 2px solid #a7f3d0;
              color: #065f46;
              padding: 16px;
              border-radius: 12px;
              margin-bottom: 24px;
              font-weight: 500;
            }
          `}</style>

          {/* Error/Success Messages */}
          {error && (
            <div className="error-message">
              ❌ {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              ✅ {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="field-group">
              <label className="field-label">
                🏷️ Titolo Annuncio *
              </label>
              <input
                type="text"
                name="titolo"
                value={fields.titolo}
                onChange={handleInputChange}
                className="glass-input"
                placeholder="es. Stanza singola luminosa in centro"
                required
              />
            </div>

            <div className="field-group">
              <label className="field-label">
                📝 Descrizione
              </label>
              <textarea
                name="descrizione"
                value={fields.descrizione}
                onChange={handleInputChange}
                className="glass-input"
                rows="4"
                placeholder="Descrivi la tua sistemazione, i servizi inclusi, regole della casa..."
                style={{ resize: 'vertical', minHeight: '120px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div className="field-group">
                <label className="field-label">
                  💰 Prezzo (€/mese) *
                </label>
                <input
                  type="number"
                  name="prezzo"
                  value={fields.prezzo}
                  onChange={handleInputChange}
                  className="glass-input"
                  placeholder="500"
                  min="0"
                  required
                />
              </div>

              <div className="field-group">
                <label className="field-label">
                  🏙️ Città *
                </label>
                <input
                  type="text"
                  name="citta"
                  value={fields.citta}
                  onChange={handleInputChange}
                  className="glass-input"
                  placeholder="Roma, Milano, Napoli..."
                  required
                />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">
                📍 Indirizzo
              </label>
              <input
                type="text"
                name="indirizzo"
                value={fields.indirizzo}
                onChange={handleInputChange}
                className="glass-input"
                placeholder="Via Roma 123, Zona Universitaria..."
              />            </div>

            <div className="field-group">
              <label className="field-label">
                📸 Immagini (massimo 5)
              </label>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
                className="glass-input"
                style={{
                  paddingTop: '12px',
                  paddingBottom: '12px'
                }}
              />
              {images.length > 0 && (
                <p style={{
                  marginTop: '12px',
                  color: '#6366f1',
                  fontWeight: '500',
                  fontSize: '14px'
                }}>
                  📎 {images.length} file{images.length > 1 ? 's' : ''} selezionato{images.length > 1 ? 'i' : ''}
                </p>
              )}
            </div>

            {/* Submit Buttons */}
            <div style={{
              display: 'flex',
              gap: '16px',
              marginTop: '3rem',
              paddingTop: '2rem',
              borderTop: '2px solid rgba(102,126,234,0.1)'
            }}>
              <button
                type="button"
                onClick={() => navigate('/listings')}
                style={{
                  flex: '1',
                  padding: '18px 32px',
                  border: '2px solid rgba(102,126,234,0.3)',
                  background: 'rgba(102,126,234,0.1)',
                  color: '#667eea',
                  borderRadius: '16px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(102,126,234,0.2)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'rgba(102,126,234,0.1)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                ↩️ Annulla
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="glass-button"
                style={{ flex: '2' }}
              >
                {loading ? (
                  <>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Pubblicando...
                  </>
                ) : (
                  <>
                    🚀 Pubblica Annuncio
                  </>
                )}
              </button>
            </div>
          </form>

          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>

        {/* Footer Info */}
        <div style={{
          textAlign: 'center',
          marginTop: '2rem',
          color: 'rgba(255,255,255,0.8)',
          fontSize: '14px'
        }}>
          <p>📋 Il tuo annuncio sarà verificato dal nostro team entro 24 ore</p>
          <p>🔒 I tuoi dati sono protetti e non saranno condivisi con terze parti</p>
        </div>
      </div>
    </div>
  );
};

export default CreateAnnouncementModern;
