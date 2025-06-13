import React from 'react';

// Test components isolati per debug
const TestListings = () => {
  const [listings, setListings] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    console.log('🔍 TestListings: Component mounted');
    
    const fetchListings = async () => {
      try {
        console.log('🔍 TestListings: Fetching data...');
        const response = await fetch('http://localhost:5000/api/announcements');
        console.log('🔍 TestListings: Response received:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('🔍 TestListings: Data received:', data);
          const announcementsArray = data.announcements || data;
          setListings(Array.isArray(announcementsArray) ? announcementsArray : []);
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (error) {
        console.error('🔍 TestListings: Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) return <div>🔄 Caricamento...</div>;
  if (error) return <div>❌ Errore: {error}</div>;

  return (
    <div style={{ padding: '20px', background: '#f0f0f0', minHeight: '100vh' }}>
      <h1>🔍 Test Listings Page</h1>
      <p>Numero annunci trovati: {listings.length}</p>
      
      {listings.length === 0 ? (
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', margin: '10px 0' }}>
          <h3>📋 Nessun Annuncio</h3>
          <p>Non ci sono annunci disponibili al momento.</p>
        </div>
      ) : (
        <div>
          {listings.map((listing, index) => (
            <div key={listing.id || index} style={{ 
              background: 'white', 
              padding: '15px', 
              margin: '10px 0', 
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3>🏠 {listing.titolo}</h3>
              <p><strong>📍 Città:</strong> {listing.città}</p>
              <p><strong>💰 Prezzo:</strong> €{listing.prezzo}/mese</p>
              <p><strong>📝 Descrizione:</strong> {listing.descrizione}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const TestPublish = () => {
  const [formData, setFormData] = React.useState({
    titolo: '',
    descrizione: '',
    prezzo: '',
    città: '',
    indirizzo: ''
  });
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('Non sei autenticato. Effettua il login prima.');
      }
      
      if (!formData.titolo || !formData.prezzo || !formData.città) {
        throw new Error('Compila tutti i campi obbligatori: titolo, prezzo e città');
      }
      
      const formDataToSend = new FormData();
      formDataToSend.append('titolo', formData.titolo);
      formDataToSend.append('descrizione', formData.descrizione);
      formDataToSend.append('prezzo', formData.prezzo);
      formDataToSend.append('città', formData.città);
      formDataToSend.append('indirizzo', formData.indirizzo);
      
      console.log('📝 TestPublish: Sending data...', formData);
      
      const response = await fetch('http://localhost:5000/api/announcements', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(`✅ Annuncio pubblicato con successo! ID: ${result.id}`);
        setFormData({
          titolo: '',
          descrizione: '',
          prezzo: '',
          città: '',
          indirizzo: ''
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Errore ${response.status}: ${errorData.message || 'Errore sconosciuto'}`);
      }
    } catch (error) {
      console.error('📝 TestPublish: Error:', error);
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    margin: '8px 0',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  };

  return (
    <div style={{ padding: '20px', background: '#f0f0f0', minHeight: '100vh' }}>
      <h1>📝 Test Publish Page</h1>
      
      {message && (
        <div style={{ 
          padding: '15px', 
          margin: '10px 0', 
          borderRadius: '4px',
          background: message.includes('✅') ? '#d4edda' : '#f8d7da',
          color: message.includes('✅') ? '#155724' : '#721c24',
          border: message.includes('✅') ? '1px solid #c3e6cb' : '1px solid #f5c6cb'
        }}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
        <input
          type="text"
          placeholder="Titolo annuncio *"
          value={formData.titolo}
          onChange={(e) => setFormData({...formData, titolo: e.target.value})}
          style={inputStyle}
          required
        />
        
        <textarea
          placeholder="Descrizione"
          value={formData.descrizione}
          onChange={(e) => setFormData({...formData, descrizione: e.target.value})}
          style={{...inputStyle, height: '80px'}}
        />
        
        <input
          type="number"
          placeholder="Prezzo (€/mese) *"
          value={formData.prezzo}
          onChange={(e) => setFormData({...formData, prezzo: e.target.value})}
          style={inputStyle}
          required
        />
        
        <input
          type="text"
          placeholder="Città *"
          value={formData.città}
          onChange={(e) => setFormData({...formData, città: e.target.value})}
          style={inputStyle}
          required
        />
        
        <input
          type="text"
          placeholder="Indirizzo"
          value={formData.indirizzo}
          onChange={(e) => setFormData({...formData, indirizzo: e.target.value})}
          style={inputStyle}
        />
        
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '15px',
            background: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '📤 Pubblicazione...' : '🚀 Pubblica Annuncio'}
        </button>
      </form>
    </div>
  );
};

// Test App principale
const TestApp = () => {
  const [currentPage, setCurrentPage] = React.useState('listings');

  return (
    <div>
      <nav style={{ 
        background: '#007bff', 
        padding: '15px',
        display: 'flex',
        gap: '10px'
      }}>
        <button 
          onClick={() => setCurrentPage('listings')}
          style={{
            background: currentPage === 'listings' ? 'white' : 'transparent',
            color: currentPage === 'listings' ? '#007bff' : 'white',
            border: '1px solid white',
            padding: '8px 15px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🔍 Cerca Casa
        </button>
        <button 
          onClick={() => setCurrentPage('publish')}
          style={{
            background: currentPage === 'publish' ? 'white' : 'transparent',
            color: currentPage === 'publish' ? '#007bff' : 'white',
            border: '1px solid white',
            padding: '8px 15px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          📝 Pubblica
        </button>
      </nav>
      
      {currentPage === 'listings' && <TestListings />}
      {currentPage === 'publish' && <TestPublish />}
    </div>
  );
};

export default TestApp;
