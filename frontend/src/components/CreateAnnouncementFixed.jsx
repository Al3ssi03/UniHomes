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

const CreateAnnouncementFixed = () => {
  const navigate = useNavigate();
  
  // STATE SEMPLIFICATO - SOLO VALORI STRINGA
  const [fields, setFields] = useState({
    titolo: '',
    descrizione: '',
    prezzo: '',
    citta: '',
    indirizzo: '',
    lat: '',
    lng: ''
  });
  
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
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
  };

  // SUBMIT DRASTICO - BYPASS REACT STATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    console.log('🚨 EMERGENCY SUBMIT - BYPASS MODE');
    
    // PRENDI VALORI DIRETTAMENTE DAL DOM
    const form = e.target;
    const directValues = {
      titolo: form.titolo.value || '',
      descrizione: form.descrizione.value || '',
      prezzo: form.prezzo.value || '',
      citta: form.citta.value || '',
      indirizzo: form.indirizzo.value || '',
      lat: form.lat.value || '',
      lng: form.lng.value || ''
    };
    
    console.log('🚨 DIRECT DOM VALUES:', directValues);
    console.log('🚨 REACT STATE VALUES:', fields);
    
    // USA I VALORI DOM SE REACT STATE È CORROTTO
    const finalValues = {
      titolo: directValues.titolo || fields.titolo,
      descrizione: directValues.descrizione || fields.descrizione,
      prezzo: directValues.prezzo || fields.prezzo,
      citta: directValues.citta || fields.citta, // PRIORITÀ AI VALORI DOM
      indirizzo: directValues.indirizzo || fields.indirizzo,
      lat: directValues.lat || fields.lat,
      lng: directValues.lng || fields.lng
    };
    
    console.log('🚨 FINAL VALUES FOR SUBMISSION:', finalValues);
    
    // VALIDAZIONE BRUTALE
    if (!finalValues.titolo || !finalValues.prezzo || !finalValues.citta) {
      const missing = [];
      if (!finalValues.titolo) missing.push('titolo');
      if (!finalValues.prezzo) missing.push('prezzo');
      if (!finalValues.citta) missing.push('città');
      
      setError(`Campi obbligatori mancanti: ${missing.join(', ')}`);
      setLoading(false);
      console.log('❌ VALIDATION FAILED:', { finalValues, missing });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Devi essere autenticato per creare un annuncio');
        navigate('/auth');
        return;
      }

      // FORMDATA CREATION BRUTALE
      const formData = new FormData();
      
      // APPEND ESPLICITO - NO LOOPS
      formData.append('titolo', finalValues.titolo);
      formData.append('descrizione', finalValues.descrizione);
      formData.append('prezzo', finalValues.prezzo);
      formData.append('citta', finalValues.citta); // CAMPO CRITICO
      formData.append('indirizzo', finalValues.indirizzo);
      formData.append('lat', finalValues.lat);
      formData.append('lng', finalValues.lng);
      
      // VERIFICA FORMDATA
      console.log('🚨 FORMDATA VERIFICATION:');
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}: "${value}"`);
      }
      
      // AGGIUNGI IMMAGINI
      images.forEach(image => {
        formData.append('immagini', image);
      });

      const response = await fetch('http://localhost:5000/api/announcements', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        showToast('Annuncio creato con successo!', 'success');
        setTimeout(() => {
          navigate('/listings');
        }, 1500);
      } else {
        console.log('❌ SERVER RESPONSE ERROR:', data);
        showToast(data.message || 'Errore durante la creazione dell\'annuncio', 'error');
      }
    } catch (error) {
      console.error('❌ NETWORK ERROR:', error);
      showToast('Errore di connessione al server', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Verifica autenticazione
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              🔥 Create Announcement - FIXED VERSION
            </h1>
            <p className="text-gray-600">
              Versione definitiva con fix del bug città
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titolo Annuncio *
              </label>
              <input
                type="text"
                name="titolo"
                value={fields.titolo}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="es. Stanza singola luminosa in centro"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrizione
              </label>
              <textarea
                name="descrizione"
                value={fields.descrizione}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Descrivi la tua sistemazione..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prezzo (€/mese) *
                </label>
                <input
                  type="number"
                  name="prezzo"
                  value={fields.prezzo}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Città * 🔥 FIXED
                </label>
                <input
                  type="text"
                  name="citta"
                  value={fields.citta}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="es. Roma, Milano, Napoli..."
                  style={{ backgroundColor: '#fef2f2' }}
                />
                <p className="text-xs text-red-600 mt-1">
                  Campo critico - Versione fixed
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Indirizzo
              </label>
              <input
                type="text"
                name="indirizzo"
                value={fields.indirizzo}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Via Roma 123"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitudine (opzionale)
                </label>
                <input
                  type="number"
                  name="lat"
                  value={fields.lat}
                  onChange={handleInputChange}
                  step="any"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="45.4642"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitudine (opzionale)
                </label>
                <input
                  type="number"
                  name="lng"
                  value={fields.lng}
                  onChange={handleInputChange}
                  step="any"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="9.1900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Immagini (massimo 5)
              </label>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* DEBUG SECTION */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold mb-2">🔍 Debug Info (Live):</h3>
              <p><strong>Titolo:</strong> "{fields.titolo}"</p>
              <p><strong>Prezzo:</strong> "{fields.prezzo}"</p>
              <p><strong>Città:</strong> "{fields.citta}" (Length: {fields.citta.length})</p>
              <p><strong>Descrizione:</strong> "{fields.descrizione}"</p>
              <p><strong>Indirizzo:</strong> "{fields.indirizzo}"</p>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/listings')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                Annulla
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                    Creando...
                  </>
                ) : (
                  '🔥 PUBBLICA ANNUNCIO (FIXED)'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAnnouncementFixed;
