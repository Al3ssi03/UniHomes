// 📁 src/pages/ListingsPage.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import OfflineMode from "../components/OfflineMode";

function haversineDistance(coords1, coords2) {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(coords2.lat - coords1.lat);
  const dLon = toRad(coords2.lng - coords1.lng);
  const lat1 = toRad(coords1.lat);
  const lat2 = toRad(coords2.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) *
    Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

export default function ListingsPage() {
  const [listings, setListings] = useState([]);
  const [filters, setFilters] = useState({ city: "", type: "", maxPrice: "", university: "", maxDistance: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
  const [loading, setLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const itemsPerPage = 6;

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.warn("Geolocalizzazione negata", err),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();

      if (filters.city) query.append("citta", filters.city);
      if (filters.maxPrice) query.append("prezzoMax", filters.maxPrice);
      if (filters.type) query.append("tipologia", filters.type);
      
      const res = await axios.get(`http://localhost:5000/api/announcements?${query.toString()}`, {
        timeout: 10000 // 10 second timeout
      });
      let data = res.data.announcements.map((a) => ({
        id: a.id,
        title: a.titolo,
        city: a.citt\u00e0,
        address: a.indirizzo,
        price: a.prezzo,
        type: a.tipologia || "",
        description: a.descrizione,
        imageUrl: a.immagini && a.immagini[0],
        lat: a.lat,
        lng: a.lng,
        User: a.User,
      }));

      if (userLocation && filters.maxDistance) {
        const maxDist = parseFloat(filters.maxDistance);
        data = data.filter((l) => {
          if (!l.lat || !l.lng) return false;
          const d = haversineDistance(userLocation, { lat: l.lat, lng: l.lng });
          return d <= maxDist;
        });
      }      setListings(data);
      setCurrentPage(1);    } catch (err) {
      console.error("Errore nel caricamento degli annunci:", err);
      // Set empty listings if API fails to prevent white screen
      setListings([]);
      
      // If connection fails, enable offline mode
      if (err.code === 'ECONNREFUSED' || err.message.includes('timeout')) {
        setIsOffline(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [filters, userLocation]);

  const handleReset = () => {
    setFilters({ city: "", type: "", maxPrice: "", university: "", maxDistance: "" });
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const paginatedListings = listings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(listings.length / itemsPerPage);

  // Show offline mode if backend is not available
  if (isOffline) {
    return <OfflineMode />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Trova il tuo <span className="text-yellow-300">alloggio perfetto</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8">
            La soluzione ideale per studenti e lavoratori
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
            <div className="flex items-center bg-white/20 px-4 py-2 rounded-full">
              <span className="mr-2">🏠</span>
              <span>{listings.length} alloggi disponibili</span>
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
        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            🔍 Filtra la tua ricerca
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Città</label>
              <input
                type="text"
                placeholder="es. Milano, Roma..."
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tipologia</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Tutti i tipi</option>
                <option value="stanza_singola">🛏️ Stanza singola</option>
                <option value="stanza_doppia">🛏️🛏️ Stanza doppia</option>
                <option value="intero_appartamento">🏠 Intero appartamento</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Prezzo massimo</label>
              <input
                type="number"
                placeholder="€ 500"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Università</label>
              <input
                type="text"
                placeholder="es. Bocconi, Sapienza..."
                value={filters.university}
                onChange={(e) => setFilters({ ...filters, university: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Distanza max (km)</label>
              <input
                type="number"
                placeholder="5 km"
                value={filters.maxDistance}
                onChange={(e) => setFilters({ ...filters, maxDistance: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button 
              onClick={handleReset} 
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              🔄 Reset filtri
            </button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">
              {loading ? "Caricamento..." : `${listings.length} alloggi trovati`}
            </h3>
            <p className="text-gray-600">Trova la sistemazione perfetta per te</p>
          </div>
          
          <div className="flex bg-white rounded-lg shadow-md p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-md transition-all ${
                viewMode === 'grid' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <span className="mr-2">⊞</span>
              Griglia
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 rounded-md transition-all ${
                viewMode === 'map' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <span className="mr-2">🗺️</span>
              Mappa
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Map View */}
        {viewMode === 'map' && userLocation && !loading && (
          <div className="h-[600px] w-full mb-8 rounded-2xl overflow-hidden shadow-lg">
            <MapContainer center={[userLocation.lat, userLocation.lng]} zoom={13} className="h-full w-full">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[userLocation.lat, userLocation.lng]} icon={defaultIcon}>
                <Popup>
                  <div className="text-center">
                    <strong>📍 Tu sei qui</strong>
                  </div>
                </Popup>
              </Marker>
              {listings.map((l) =>
                l.lat && l.lng ? (
                  <Marker key={l.id} position={[l.lat, l.lng]} icon={defaultIcon}>
                    <Popup>
                      <div className="min-w-[200px]">
                        <h4 className="font-bold text-gray-800">{l.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{l.city}</p>
                        <p className="text-lg font-bold text-blue-600">€{l.price}/mese</p>
                        <Link
                          to={`/annuncio/${l.id}`}
                          className="inline-block mt-2 bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                        >
                          Vedi dettagli
                        </Link>
                      </div>
                    </Popup>
                  </Marker>
                ) : null
              )}
            </MapContainer>
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && !loading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedListings.map((listing) => (
                <div key={listing.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(listing.id);
                      }}
                      className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all ${
                        favorites.includes(listing.id) 
                          ? "bg-red-500 text-white shadow-lg" 
                          : "bg-white/90 text-gray-600 hover:text-red-500 hover:bg-white"
                      }`}
                    >
                      ♥
                    </button>
                    
                    <img
                      src={listing.imageUrl ? `http://localhost:5000${listing.imageUrl}` : "https://via.placeholder.com/400x250?text=No+Image"}
                      alt={listing.title}
                      className="w-full h-56 object-cover"
                    />
                    
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-sm font-medium text-gray-800">
                        {listing.type === 'stanza_singola' && '🛏️ Singola'}
                        {listing.type === 'stanza_doppia' && '🛏️🛏️ Doppia'}
                        {listing.type === 'intero_appartamento' && '🏠 Appartamento'}
                        {!listing.type && '🏠 Alloggio'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-800 line-clamp-2">
                        {listing.title}
                      </h3>
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-2">
                      <span className="mr-2">📍</span>
                      <span className="text-sm">{listing.city}</span>
                    </div>
                    
                    {listing.User && (
                      <div className="flex items-center text-gray-500 mb-3">
                        <span className="mr-2">👤</span>
                        <span className="text-sm">
                          {listing.User.nome} {listing.User.cognome}
                        </span>
                      </div>
                    )}
                    
                    {userLocation && listing.lat && listing.lng && (
                      <div className="flex items-center text-gray-500 mb-4">
                        <span className="mr-2">📏</span>
                        <span className="text-sm">
                          A {Math.round(haversineDistance(userLocation, { lat: listing.lat, lng: listing.lng }))} km da te
                        </span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-bold text-blue-600">€{listing.price}</span>
                        <span className="text-gray-500 text-sm">/mese</span>
                      </div>
                      
                      <Link
                        to={`/annuncio/${listing.id}`}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-md hover:shadow-lg"
                      >
                        Vedi dettagli
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {paginatedListings.length === 0 && !loading && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Nessun alloggio trovato
                </h3>
                <p className="text-gray-600 mb-6">
                  Prova a modificare i filtri di ricerca per trovare più risultati
                </p>
                <button 
                  onClick={handleReset}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Reset filtri
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        currentPage === i + 1 
                          ? "bg-blue-600 text-white shadow-md" 
                          : "bg-white text-blue-600 hover:bg-blue-50 border border-blue-200"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
