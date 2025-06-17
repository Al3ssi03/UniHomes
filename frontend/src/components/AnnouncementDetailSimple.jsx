import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const AnnouncementDetailSimple = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '2rem',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)'
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
          🏠 Dettaglio Annuncio
        </h1>
        
        <div style={{
          background: 'rgba(255, 255, 255, 0.2)',
          padding: '1.5rem',
          borderRadius: '10px',
          marginBottom: '2rem'
        }}>
          <h2>📋 Informazioni Debug</h2>
          <p><strong>ID Annuncio:</strong> {id}</p>
          <p><strong>URL attuale:</strong> {window.location.href}</p>
          <p><strong>Timestamp:</strong> {new Date().toLocaleString()}</p>
        </div>

        <div style={{
          background: 'rgba(0, 255, 0, 0.2)',
          padding: '1.5rem',
          borderRadius: '10px',
          marginBottom: '2rem'
        }}>
          <h2>✅ Successo!</h2>
          <p>Se vedi questo messaggio, significa che:</p>
          <ul>
            <li>✅ Il routing React funziona</li>
            <li>✅ Il componente AnnouncementDetail viene caricato</li>
            <li>✅ Il parametro ID viene passato correttamente</li>
            <li>✅ Il problema è stato risolto!</li>
          </ul>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/listings')}
            style={{
              background: '#6366f1',
              color: 'white',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            ← Torna alla Lista
          </button>
          
          <button
            onClick={() => navigate('/annuncio/1')}
            style={{
              background: '#10b981',
              color: 'white',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Test Annuncio #1
          </button>
          
          <button
            onClick={() => navigate('/annuncio/6')}
            style={{
              background: '#f59e0b',
              color: 'white',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Test Annuncio #6
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementDetailSimple;
