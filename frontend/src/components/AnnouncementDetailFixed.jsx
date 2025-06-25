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
    'pisa': { lat: 43.7228, lng: 10.4017 },
    'catania': { lat: 37.5079, lng: 15.0830 },
    'verona': { lat: 45.4384, lng: 10.9916 },
    'messina': { lat: 38.1938, lng: 15.5540 },
    'trieste': { lat: 45.6495, lng: 13.7768 },
    'brescia': { lat: 45.5416, lng: 10.2118 },
    'parma': { lat: 44.8015, lng: 10.3279 },
    'modena': { lat: 44.6471, lng: 10.9252 },
    'reggio calabria': { lat: 38.1113, lng: 15.6599 },
    'reggio emilia': { lat: 44.6989, lng: 10.6298 },
    'perugia': { lat: 43.1122, lng: 12.3888 },
    'livorno': { lat: 43.5482, lng: 10.3116 },
    'cagliari': { lat: 39.2238, lng: 9.1217 },
    'foggia': { lat: 41.4621, lng: 15.5444 },
    'salerno': { lat: 40.6824, lng: 14.7681 },
    'ferrara': { lat: 44.8381, lng: 11.6197 },
    'rimini': { lat: 44.0678, lng: 12.5695 },
    'siena': { lat: 43.3188, lng: 11.3307 },
    'bergamo': { lat: 45.6983, lng: 9.6773 },
    'udine': { lat: 46.0748, lng: 13.2345 },
    'cosenza': { lat: 39.2986, lng: 16.2543 },
    'lecce': { lat: 40.3514, lng: 18.1750 }
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
      
      // Normalizza il campo città - supporta diverse varianti dal database
      const city = getCity(data);
      const address = data.indirizzo || data.via || data.address || null;
      
      console.log('🏙️ Città estratta:', city);
      console.log('🏠 Indirizzo estratto:', address);
      
      // Prova il geocoding con fallback
      if (city !== 'Città non specificata') {
        await geocodeWithFallback(address, city);
      } else {
        console.warn('❌ Nessuna città specificata nell\'annuncio');
        setGeocodingStatus('error');
        // Usa coordinate di Roma come fallback anche se non c'è città
        const fallbackCoords = { lat: 41.9028, lng: 12.4964 };
        setCoordinates(fallbackCoords);
        calculateNearbyUniversities(fallbackCoords);
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
    console.log(`🗺️ Tentativo geocoding per indirizzo: "${indirizzo}", città: "${città}"`);
    
    // Prova 1: Geocoding preciso con indirizzo completo (PRIORITÀ MASSIMA)
    if (indirizzo && indirizzo.trim() && città) {
      try {
        const fullAddress = `${indirizzo.trim()}, ${città.trim()}, Italia`;
        console.log(`🌐 Tentativo geocoding PRECISO: "${fullAddress}"`);
        const coords = await tryGeocoding(fullAddress);
        if (coords) {
          setCoordinates(coords);
          calculateNearbyUniversities(coords);
          setGeocodingStatus('success');
          console.log('✅ Geocoding PRECISO riuscito con indirizzo completo:', coords);
          return;
        }
      } catch (error) {
        console.warn('⚠️ Geocoding preciso fallito:', error);
      }
    }

    // Prova 2: Geocoding solo con città
    if (città) {
      try {
        const cityAddress = `${città.trim()}, Italia`;
        console.log(`🌐 Tentativo geocoding solo città: "${cityAddress}"`);
        const coords = await tryGeocoding(cityAddress);
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
    }

    // Prova 3: Coordinate predefinite per città principali (FALLBACK)
    const cityKey = città ? città.toLowerCase().trim() : '';
    if (cityCoordinates[cityKey]) {
      const coords = cityCoordinates[cityKey];
      setCoordinates(coords);
      calculateNearbyUniversities(coords);
      setGeocodingStatus('success');
      setMapError(true); // Indica che è approssimativo
      console.log('⚠️ Usate coordinate predefinite (approssimative) per', città, ':', coords);
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

  const formatDate = (dateString) => {
    if (!dateString) return 'Data non disponibile';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Data non valida';
      }
      return date.toLocaleDateString('it-IT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Errore formato data:', error);
      return 'Data non disponibile';
    }
  };

  // Helper per ottenere la città dall'annuncio
  const getCity = (announcement) => {
    return announcement.città || announcement.citta || announcement.city || announcement.location || 'Città non specificata';
  };

  // Helper per ottenere l'indirizzo completo
  const getFullAddress = (announcement) => {
    const address = announcement.indirizzo || announcement.via || announcement.address || '';
    const city = getCity(announcement);
    
    if (address && city !== 'Città non specificata') {
      return `${address}, ${city}`;
    } else if (city !== 'Città non specificata') {
      return city;
    } else if (address) {
      return address;
    } else {
      return 'Indirizzo non specificato';
    }
  };

  const tryGeocoding = async (address) => {
    console.log('🌐 Tentativo geocoding per:', address);
    
    // API 1: Nominatim OpenStreetMap (principale)
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&countrycodes=it&addressdetails=1`;
      console.log('🌐 URL Nominatim:', url);
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'UNI-Home-App/1.0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📍 Risposta Nominatim:', data);
      
      if (data && data.length > 0) {
        const result = {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
        console.log('✅ Coordinate trovate con Nominatim:', result);
        return result;
      }
    } catch (error) {
      console.warn('⚠️ Nominatim fallito:', error);
    }

    // API 2: Photon (fallback alternativo)
    try {
      const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(address)}&limit=1&lang=it`;
      console.log('🌐 URL Photon (fallback):', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📍 Risposta Photon:', data);
      
      if (data && data.features && data.features.length > 0) {
        const coords = data.features[0].geometry.coordinates;
        const result = {
          lat: coords[1],
          lng: coords[0]
        };
        console.log('✅ Coordinate trovate con Photon:', result);
        return result;
      }
    } catch (error) {
      console.warn('⚠️ Photon fallito:', error);
    }

    console.warn('❌ Tutti i servizi di geocoding hanno fallito per:', address);
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
    if (!message.trim()) {
      alert('⚠️ Inserisci un messaggio prima di inviare');
      return;
    }
    
    setSendingMessage(true);
    try {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      
      if (!token) {
        alert('❌ Devi essere autenticato per inviare messaggi');
        setSendingMessage(false);
        return;
      }

      if (!userData) {
        alert('❌ Dati utente non trovati');
        setSendingMessage(false);
        return;
      }

      const userInfo = JSON.parse(userData);
      
      console.log('📤 Invio messaggio...', {
        recipientId: announcement.utente_id,
        announcementId: announcement.id,
        senderName: userInfo.nome || userInfo.username || 'Utente'
      });
      
      const response = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          recipientId: announcement.utente_id,
          announcementId: announcement.id,
          content: message.trim(),
          senderName: userInfo.nome || userInfo.username || 'Utente'
        })
      });

      console.log('📤 Risposta server:', response.status, response.statusText);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Messaggio inviato:', result);
        alert('✅ Messaggio inviato con successo!');
        setMessage('');
        setShowMessageModal(false);
      } else {
        const errorData = await response.text();
        console.error('❌ Errore server:', response.status, errorData);
        alert(`❌ Errore nell'invio: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error('❌ Errore invio messaggio:', error);
      alert(`❌ Errore di connessione: ${error.message}`);
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
                <p><strong>📍 Indirizzo:</strong> {announcement.indirizzo || 'Non specificato'}</p>
                <p><strong>🏙️ Città:</strong> {getCity(announcement)}</p>
                <p><strong>📅 Pubblicato:</strong> {formatDate(announcement.data_creazione)}</p>
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
                  ⚠️ Posizione approssimativa - utilizzate coordinate generiche della città
                </div>
              )}

              {geocodingStatus === 'success' && !mapError && (
                <div style={{
                  background: 'rgba(34, 197, 94, 0.2)',
                  padding: '10px',
                  borderRadius: '8px',
                  marginBottom: '15px',
                  fontSize: '14px'
                }}>
                  ✅ Posizione precisa trovata tramite geocoding dell'indirizzo
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
                    Indirizzo: {getFullAddress(announcement)}
                  </p>
                  <button 
                    onClick={() => geocodeWithFallback(announcement.indirizzo, getCity(announcement))}
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
                  {mapError ? (
                    <span style={{ color: '#ffa500' }}> (coordinate generiche città)</span>
                  ) : (
                    <span style={{ color: '#22c55e' }}> (indirizzo specifico)</span>
                  )}
                  <br />
                  🏠 Indirizzo ricercato: {getFullAddress(announcement)}
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
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', marginBottom: '20px' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  flexShrink: 0
                }}>
                  👤
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>
                    {announcement.User?.nome && announcement.User?.cognome 
                      ? `${announcement.User.nome} ${announcement.User.cognome}`
                      : announcement.User?.username || 'Proprietario'
                    }
                  </p>
                  
                  {/* Informazioni di contatto */}
                  {announcement.User?.email && (
                    <p style={{ opacity: 0.8, margin: '0 0 5px 0', fontSize: '14px' }}>
                      📧 {announcement.User.email}
                    </p>
                  )}
                  
                  {announcement.User?.telefono && (
                    <p style={{ opacity: 0.8, margin: '0 0 5px 0', fontSize: '14px' }}>
                      📱 {announcement.User.telefono}
                    </p>
                  )}
                  
                  {/* Località */}
                  {(announcement.User?.citta || announcement.User?.provincia) && (
                    <p style={{ opacity: 0.8, margin: '0 0 5px 0', fontSize: '14px' }}>
                      � {[announcement.User?.citta, announcement.User?.provincia].filter(Boolean).join(', ')}
                    </p>
                  )}
                  
                  {/* Professione */}
                  {announcement.User?.professione && (
                    <p style={{ opacity: 0.8, margin: '0 0 5px 0', fontSize: '14px' }}>
                      💼 {announcement.User.professione}
                    </p>
                  )}
                  
                  <p style={{ opacity: 0.7, margin: '8px 0 0 0', fontSize: '14px' }}>
                    📅 Pubblicato il {formatDate(announcement.data_creazione)}
                  </p>
                  
                  {/* Biografia */}
                  {announcement.User?.biografia && (
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '12px',
                      borderRadius: '8px',
                      marginTop: '12px',
                      fontSize: '14px',
                      lineHeight: '1.4'
                    }}>
                      <p style={{ margin: '0 0 5px 0', fontWeight: '500', opacity: 0.9 }}>📝 Descrizione</p>
                      <p style={{ margin: 0, opacity: 0.8 }}>
                        {announcement.User.biografia}
                      </p>
                    </div>
                  )}
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
                Contatta <strong>
                  {announcement.User?.nome && announcement.User?.cognome 
                    ? `${announcement.User.nome} ${announcement.User.cognome}`
                    : announcement.User?.username || 'il proprietario'
                  }
                </strong> per l'annuncio "{announcement.titolo}"
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
