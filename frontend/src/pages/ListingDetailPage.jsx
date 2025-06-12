// 📁 src/pages/ListingDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ListingChat from "../components/ListingChat";

export default function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/announcements/${id}`);
        const a = res.data;
        setListing({
          id: a.id,
          title: a.titolo,
          city: a.città,
          address: a.indirizzo,
          price: a.prezzo,
          type: a.tipologia || "",
          description: a.descrizione,
          services: a.servizi ? JSON.parse(a.servizi) : [],
          imageUrl: a.immagini && a.immagini[0],
          available_from: a.disponibile_da,
          university: a.università,
          User: a.User,
        });
      } catch (err) {
        console.error("Errore nel recupero dell'annuncio:", err);
        setError("Errore nel caricamento dell'annuncio");
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'stanza_singola': return '🛏️';
      case 'stanza_doppia': return '🛏️🛏️';
      case 'intero_appartamento': return '🏠';
      default: return '📍';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'stanza_singola': return 'Stanza singola';
      case 'stanza_doppia': return 'Stanza doppia';
      case 'intero_appartamento': return 'Intero appartamento';
      default: return type.replace("_", " ");
    }
  };

  const getServiceIcon = (service) => {
    const icons = {
      wifi: "📶",
      lavatrice: "🧺",
      riscaldamento: "🔥",
      animali_ammessi: "🐕",
      parking: "🅿️",
      cucina: "🍳",
      terrazzo: "🌿",
      aria_condizionata: "❄️"
    };
    return icons[service] || "✅";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento annuncio...</p>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Annuncio non trovato</h2>
          <p className="text-gray-600 mb-6">{error || "L'annuncio che stai cercando non esiste o è stato rimosso."}</p>
          <button
            onClick={() => navigate("/alloggi")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Torna agli alloggi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Indietro
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Image */}
              {listing.imageUrl && (
                <div className="relative h-96">
                  <img
                    src={`http://localhost:5000${listing.imageUrl}`}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {getTypeIcon(listing.type)} {getTypeLabel(listing.type)}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-600 text-white px-4 py-2 rounded-full text-lg font-bold">
                      €{listing.price}/mese
                    </span>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">{listing.title}</h1>
                
                {/* Location & Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="font-medium">{listing.city}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span>{listing.address}</span>
                    </div>
                    {listing.university && (
                      <div className="flex items-center text-gray-600">
                        <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        </svg>
                        <span>Vicino a {listing.university}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Disponibile dal {new Date(listing.available_from).toLocaleDateString('it-IT')}</span>
                    </div>
                  </div>
                </div>

                {/* Services */}
                {listing.services && listing.services.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">🛠️ Servizi inclusi</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {listing.services.map((service) => (
                        <div key={service} className="flex items-center p-3 bg-blue-50 rounded-lg">
                          <span className="text-lg mr-2">{getServiceIcon(service)}</span>
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {service.replace("_", " ")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">📝 Descrizione</h3>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{listing.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
              {/* Owner Info */}
              {listing.User && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">👤 Proprietario</h3>
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                      {listing.User.nome?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {listing.User.nome} {listing.User.cognome}
                      </p>
                      <p className="text-sm text-gray-500">Proprietario</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Price Summary */}
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">€{listing.price}</p>
                  <p className="text-gray-600">al mese</p>
                </div>
              </div>

              {/* Contact */}
              {listing.User && (
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">💬 Contatta il proprietario</h3>
                  <ListingChat listingId={listing.id} receiverId={listing.User.id} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
