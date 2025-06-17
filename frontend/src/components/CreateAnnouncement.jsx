import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from './ToastContainer';
import axios from 'axios';

const CreateAnnouncement = () => {
  const navigate = useNavigate();  const [formData, setFormData] = useState({
    titolo: '',
    descrizione: '',
    prezzo: '',
    citta: '',
    indirizzo: ''
  });

  // Debug: Log initial state and any changes
  useEffect(() => {
    console.log('🔄 FormData state changed:', formData);
  }, [formData]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const cityDropdownRef = useRef(null);
  const addressDropdownRef = useRef(null);

  useEffect(() => {
    // Click outside handler for city dropdown
    const handleClickOutside = (event) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target)) {
        setShowCityDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Funzione per cercare le città
  const searchCities = async (query) => {
    setIsLoadingCities(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/cities?q=${query}`);
      setFilteredCities(response.data);
    } catch (error) {
      console.error('Errore nella ricerca delle città:', error);
      showToast('Errore nel caricamento delle città', 'error');
    } finally {
      setIsLoadingCities(false);
    }
  };  // Gestione dell'input della città
  const handleCityInputChange = (e) => {
    const value = e.target.value;
    console.log('🏙️ City input change:', value);
    setFormData(prev => {
      const updated = { ...prev, citta: value };
      console.log('🏙️ Updated form data after city change:', updated);
      return updated;
    });
    
    if (value.length >= 2) {
      searchCities(value);
      setShowCityDropdown(true);
    } else {
      setFilteredCities([]);
      setShowCityDropdown(false);
    }
  };  // Selezione di una città dal dropdown
  const handleCitySelect = (city) => {
    console.log('🏙️ City selected from dropdown:', city);
    setFormData(prev => {
      const updated = {
        ...prev,
        citta: city.nome,
        provincia: city.provincia,
        regione: city.regione
      };
      console.log('🏙️ Updated form data after city selection:', updated);
      return updated;
    });
    setShowCityDropdown(false);
  };
  // Funzione per cercare indirizzi basati sulla città selezionata
  const searchAddresses = async (query) => {
    if (!formData.citta) return;
    
    setIsLoadingAddress(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/geocoding/search`, {
        params: {
          query: query,
          city: formData.citta
        }
      });
      
      setAddresses(response.data);
    } catch (error) {
      console.error('Errore nella ricerca degli indirizzi:', error);
      showToast('Errore nella ricerca degli indirizzi', 'error');
    } finally {
      setIsLoadingAddress(false);
    }
  };
  // Gestione dell'input dell'indirizzo
  const handleAddressInputChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, indirizzo: value }));
    
    if (value.length >= 3 && formData.citta) {
      searchAddresses(value);
      setShowAddressDropdown(true);
    } else {
      setAddresses([]);
      setShowAddressDropdown(false);
    }
  };
  // Selezione di un indirizzo dal dropdown
  const handleAddressSelect = (address) => {
    setFormData(prev => ({
      ...prev,
      indirizzo: address.display_name
    }));
    setShowAddressDropdown(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input change - Field: ${name}, Value: ${value}`);
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: value
      };
      console.log('Updated form data:', updated);
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
  };  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    // EMERGENCY FIX: Get values directly from form elements
    const form = e.target;
    const formElements = form.elements;
      const directFormData = {
      titolo: formElements.titolo?.value || '',
      descrizione: formElements.descrizione?.value || '',
      prezzo: formElements.prezzo?.value || '',
      citta: formElements.citta?.value || '',
      indirizzo: formElements.indirizzo?.value || ''
    };
    
    console.log('🚨 EMERGENCY DEBUG - Direct form elements:');
    console.log('📋 Direct form data:', directFormData);
    console.log('📋 React state data:', formData);
    console.log('🔍 City comparison:');
    console.log('  - From form element:', formElements.citta?.value);
    console.log('  - From React state:', formData.citta);
    console.log('  - Input element exists:', !!formElements.citta);
      // Use direct form data if React state is corrupted
    const finalFormData = {
      titolo: directFormData.titolo || formData.titolo,
      descrizione: directFormData.descrizione || formData.descrizione,
      prezzo: directFormData.prezzo || formData.prezzo,
      citta: directFormData.citta || formData.citta,
      indirizzo: directFormData.indirizzo || formData.indirizzo
    };
    
    console.log('🔧 FINAL FORM DATA:', finalFormData);
    
    // Validazione dei campi obbligatori
    if (!finalFormData.titolo || !finalFormData.prezzo || !finalFormData.citta) {
      console.log('❌ Validation failed with final data:', {
        titolo: !finalFormData.titolo,
        prezzo: !finalFormData.prezzo,
        citta: !finalFormData.citta,
        cittaValue: finalFormData.citta
      });
      setError('Titolo, prezzo e città sono campi obbligatori');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Devi essere autenticato per creare un annuncio');
        navigate('/auth');
        return;
      }      const formDataToSend = new FormData();
      
      // Use the corrected final form data
      console.log('🔧 Creating FormData with corrected values...');
        // EXPLICIT field mapping with guaranteed correct field names
      formDataToSend.append('titolo', finalFormData.titolo);
      formDataToSend.append('descrizione', finalFormData.descrizione);
      formDataToSend.append('prezzo', finalFormData.prezzo);
      formDataToSend.append('citta', finalFormData.citta);  // GUARANTEED correct field name
      formDataToSend.append('indirizzo', finalFormData.indirizzo);
      
      // DEBUG: Verify final FormData
      console.log('✅ Final FormData verification:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`  "${key}": "${value}"`);
      }

      // Aggiungi le immagini
      images.forEach(image => {
        formDataToSend.append('immagini', image);
      });

      const response = await fetch('http://localhost:5000/api/announcements', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();      if (response.ok) {
        showToast('Annuncio creato con successo!', 'success');
        setTimeout(() => {
          navigate('/listings');
        }, 1500);
      } else {
        showToast(data.message || 'Errore durante la creazione dell\'annuncio', 'error');
      }
    } catch (error) {
      console.error('Errore:', error);
      showToast('Errore di connessione al server', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Verifica se l'utente è autenticato
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Pubblica il tuo Annuncio
            </h1>
            <p className="text-gray-600">
              Condividi la tua sistemazione con studenti e lavoratori
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
              {success}
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
                value={formData.titolo}
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
                value={formData.descrizione}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Descrivi la tua sistemazione, i servizi inclusi, regole della casa..."
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
                  value={formData.prezzo}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="500"
                />
              </div>

              <div className="relative" ref={cityDropdownRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Città *
                </label>
                <div className="relative">                  <input
                    type="text"
                    name="citta"
                    value={formData.citta || ''}
                    onChange={handleCityInputChange}
                    onFocus={() => setShowCityDropdown(true)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Inizia a digitare il nome della città..."
                    autoComplete="off"
                    data-field="citta"
                  />
                  {formData.citta && (
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, citta: '', provincia: '', regione: '' }));
                        setFilteredCities([]);
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>
                
                {showCityDropdown && (filteredCities.length > 0 || isLoadingCities) && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {isLoadingCities ? (
                      <div className="p-4 text-center text-gray-500">
                        <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                        Ricerca città...
                      </div>
                    ) : (
                      <ul className="py-1">
                        {filteredCities.map((city) => (
                          <li
                            key={city.id}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-gray-700"
                            onClick={() => handleCitySelect(city)}
                          >
                            <span className="font-medium">{city.nome}</span>
                            <span className="ml-2 text-sm text-gray-500">
                              ({city.provincia}, {city.regione})
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
                
                {formData.citta.length >= 2 && filteredCities.length === 0 && !isLoadingCities && showCityDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-500">
                    Nessuna città trovata
                  </div>
                )}
                
                {error && error.includes('città') && (
                  <p className="text-red-500 text-sm mt-1">Seleziona una città dall'elenco</p>
                )}
              </div>
            </div>

            <div className="relative" ref={addressDropdownRef}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Indirizzo *
              </label>
              <div className="relative">                  <input
                  type="text"
                  name="indirizzo"
                  value={formData.indirizzo}
                  onChange={handleAddressInputChange}
                  onFocus={() => formData.citta && setShowAddressDropdown(true)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder={formData.citta ? "Cerca indirizzo..." : "Prima seleziona una città"}
                  disabled={!formData.citta}
                />
                {formData.indirizzo && (
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, indirizzo: '' }));
                      setAddresses([]);
                    }}
                  >
                    ×
                  </button>
                )}
                {isLoadingAddress && (
                  <div className="absolute right-10 top-1/2 -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  </div>
                )}
              </div>            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Immagini (massimo 5)
              </label>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {images.length > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  {images.length} file{images.length > 1 ? 's' : ''} selezionato{images.length > 1 ? 'i' : ''}
                </p>
              )}
            </div>            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => {
                  console.log('🔍 DEBUG: Current form state:', formData);
                  alert(`Debug Info:\nTitolo: "${formData.titolo}"\nPrezzo: "${formData.prezzo}"\nCitta: "${formData.citta}" (type: ${typeof formData.citta})\nDescrizione: "${formData.descrizione}"\nIndirizzo: "${formData.indirizzo}"`);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200"
              >
                🔍 Debug State
              </button>
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
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Pubblicando...
                  </>
                ) : (
                  'Pubblica Annuncio'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAnnouncement;
