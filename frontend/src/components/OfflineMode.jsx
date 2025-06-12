// 📁 src/components/OfflineMode.jsx
import React from 'react';

export default function OfflineMode() {
  const mockListings = [
    {
      id: 1,
      title: "Stanza singola vicino Università Bocconi",
      city: "Milano",
      price: 650,
      type: "stanza_singola",
      imageUrl: null,
      User: { nome: "Mario", cognome: "Rossi" }
    },
    {
      id: 2,
      title: "Appartamento moderno zona Trastevere",
      city: "Roma",
      price: 1200,
      type: "intero_appartamento",
      imageUrl: null,
      User: { nome: "Giulia", cognome: "Bianchi" }
    },
    {
      id: 3,
      title: "Stanza doppia studenti Politecnico",
      city: "Torino", 
      price: 400,
      type: "stanza_doppia",
      imageUrl: null,
      User: { nome: "Luca", cognome: "Verdi" }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Trova il tuo <span className="text-yellow-300">alloggio perfetto</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-4">
            La soluzione ideale per studenti e lavoratori
          </p>
          <div className="bg-orange-500/20 backdrop-blur-sm rounded-lg p-3 mb-6 max-w-md mx-auto">
            <div className="flex items-center justify-center">
              <span className="mr-2">⚠️</span>
              <span className="text-sm">Modalità Demo - Server non disponibile</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
            <div className="flex items-center bg-white/20 px-4 py-2 rounded-full">
              <span className="mr-2">🏠</span>
              <span>{mockListings.length} alloggi demo</span>
            </div>
            <div className="flex items-center bg-white/20 px-4 py-2 rounded-full">
              <span className="mr-2">📍</span>
              <span>In tutta Italia</span>
            </div>
            <div className="flex items-center bg-white/20 px-4 py-2 rounded-full">
              <span className="mr-2">✨</span>
              <span>Verificati e sicuri</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="text-center">
            <div className="text-4xl mb-4">🔧</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Modalità Demo
            </h2>
            <p className="text-gray-600 mb-4">
              Il server backend non è disponibile. Stai visualizzando dati di esempio.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              🔄 Riprova connessione
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockListings.map((listing) => (
            <div key={listing.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative">
                <img
                  src="https://via.placeholder.com/400x250?text=Demo+Image"
                  alt={listing.title}
                  className="w-full h-56 object-cover"
                />
                
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-sm font-medium text-gray-800">
                    {listing.type === 'stanza_singola' && '🛏️ Singola'}
                    {listing.type === 'stanza_doppia' && '🛏️🛏️ Doppia'}
                    {listing.type === 'intero_appartamento' && '🏠 Appartamento'}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {listing.title}
                </h3>
                
                <div className="flex items-center text-gray-600 mb-2">
                  <span className="mr-2">📍</span>
                  <span className="text-sm">{listing.city}</span>
                </div>
                
                <div className="flex items-center text-gray-500 mb-4">
                  <span className="mr-2">👤</span>
                  <span className="text-sm">
                    {listing.User.nome} {listing.User.cognome}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold text-blue-600">€{listing.price}</span>
                    <span className="text-gray-500 text-sm">/mese</span>
                  </div>
                  
                  <button
                    disabled
                    className="bg-gray-400 text-white px-6 py-3 rounded-lg cursor-not-allowed font-medium"
                  >
                    Demo Mode
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
