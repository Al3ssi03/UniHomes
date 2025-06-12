import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from './ToastContainer';

const CreateAnnouncement = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titolo: '',
    descrizione: '',
    prezzo: '',
    città: '',
    indirizzo: '',
    lat: '',
    lng: ''
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setError('Puoi caricare massimo 5 immagini');
      return;
    }
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Devi essere autenticato per creare un annuncio');
        navigate('/auth');
        return;
      }

      const formDataToSend = new FormData();
      
      // Aggiungi i dati del form
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Città *
                </label>
                <input
                  type="text"
                  name="città"
                  value={formData.città}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Milano"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Indirizzo
              </label>
              <input
                type="text"
                name="indirizzo"
                value={formData.indirizzo}
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
                  value={formData.lat}
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
                  value={formData.lng}
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {images.length > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  {images.length} file{images.length > 1 ? 's' : ''} selezionato{images.length > 1 ? 'i' : ''}
                </p>
              )}
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
