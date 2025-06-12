// Enhanced ListingsPage with SearchAutocomplete and AdvancedFilters
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import SearchAutocomplete from "../components/SearchAutocomplete";
import AdvancedFilters from "../components/AdvancedFilters";
import PriceRangeSlider from "../components/PriceRangeSlider";
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

export default function EnhancedListingsPage() {
  const [listings, setListings] = useState([]);
  const [filters, setFilters] = useState({ 
    city: "", 
    type: "", 
    minPrice: 0,
    maxPrice: 2000, 
    university: "", 
    maxDistance: "",
    services: []
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
  const [loading, setLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const itemsPerPage = 9;

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
      console.log("🔍 Fetching listings from backend...");
      setLoading(true);
      const query = new URLSearchParams();

      if (filters.city) query.append("citta", filters.city);
      if (filters.maxPrice < 2000) query.append("prezzoMax", filters.maxPrice);
      if (filters.minPrice > 0) query.append("prezzoMin", filters.minPrice);
      if (filters.type) query.append("tipologia", filters.type);
      if (filters.university) query.append("università", filters.university);
      
      const res = await axios.get(`http://localhost:5000/api/announcements?${query.toString()}`, {
        timeout: 10000 // 10 second timeout
      });
      
      console.log("✅ Backend response:", res.data);
      
      let data = res.data.announcements.map((a) => ({
        id: a.id,
        title: a.titolo,
        city: a.città,
        address: a.indirizzo,
        price: a.prezzo,
        type: a.tipologia || "",
        description: a.descrizione,
        imageUrl: a.immagini && a.immagini[0],
        lat: a.lat,
        lng: a.lng,
        User: a.User,
        services: a.servizi ? JSON.parse(a.servizi) : [],
        university: a.università,
        available_from: a.disponibile_da
      }));

      // Apply client-side filters
      if (filters.services.length > 0) {
        data = data.filter((listing) => 
          filters.services.every(service => listing.services.includes(service))
        );
      }

      if (userLocation && filters.maxDistance) {
        const maxDist = parseFloat(filters.maxDistance);
        data = data.filter((l) => {
          if (!l.lat || !l.lng) return false;
          const d = haversineDistance(userLocation, { lat: l.lat, lng: l.lng });
          return d <= maxDist;
        });
      }
      
      setListings(data);
      setCurrentPage(1);
      console.log(`📋 Loaded ${data.length} listings`);
    } catch (err) {
      console.error("❌ Errore nel caricamento degli annunci:", err);
      setListings([]);
      
      if (err.code === 'ECONNREFUSED' || err.message.includes('timeout')) {
        console.log("🔌 Attivazione modalità offline");
        setIsOffline(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [filters, userLocation]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleCitySelect = (city) => {
    setFilters(prev => ({ ...prev, city }));
  };

  const handlePriceChange = (minPrice, maxPrice) => {
    setFilters(prev => ({ ...prev, minPrice, maxPrice }));
  };

  const handleReset = () => {
    setFilters({ 
      city: "", 
      type: "", 
      minPrice: 0,
      maxPrice: 2000, 
      university: "", 
      maxDistance: "",
      services: []
    });
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
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Trova il tuo <span className="text-yellow-300">alloggio perfetto</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-12">
            La piattaforma più avanzata per la ricerca di alloggi
          </p>
          
          {/* Enhanced Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <SearchAutocomplete 
              onCitySelect={handleCitySelect}
              value={filters.city}
              placeholder="🔍 Cerca la tua città ideale..."
            />
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
            <div className="flex items-center bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
              <span className="mr-2">🏠</span>
              <span>{listings.length} alloggi disponibili</span>
            </div>
            <div className="flex items-center bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
              <span className="mr-2">📍</span>
              <span>In tutta Italia</span>
            </div>
            <div className="flex items-center bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
              <span className="mr-2">✨</span>
              <span>Verificati e sicuri</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Enhanced Filters Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              🎯 Filtri intelligenti
            </h2>
            <button 
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              <span className="mr-2">⚙️</span>
              {showAdvancedFilters ? 'Nascondi filtri avanzati' : 'Mostra filtri avanzati'}
            </button>
          </div>

          {/* Price Range Slider */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Fascia di prezzo (€/mese)
            </label>
            <PriceRangeSlider 
              min={0}
              max={2000}
              value={[filters.minPrice, filters.maxPrice]}
              onChange={handlePriceChange}
            />
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <AdvancedFilters 
              filters={filters}
              onFiltersChange={handleFiltersChange}
              userLocation={userLocation}
            />
          )}

          <div className="flex justify-center mt-6 space-x-4">
            <button 
              onClick={handleReset} 
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center"
            >
              <span className="mr-2">🔄</span>
              Reset filtri
            </button>
            <button 
              onClick={fetchListings}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
            >
              <span className="mr-2">🔍</span>
              Aggiorna ricerca
            </button>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h3 className="text-3xl font-bold text-gray-800">
              {loading ? "Caricamento..." : `${listings.length} alloggi trovati`}
            </h3>
            <p className="text-gray-600 text-lg">
              {filters.city && `a ${filters.city} • `}
              Trova la sistemazione perfetta per te
            </p>
          </div>
          
          <div className="flex bg-white rounded-lg shadow-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-6 py-3 rounded-md transition-all font-medium ${
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
              className={`px-6 py-3 rounded-md transition-all font-medium ${
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
          <div className="flex justify-center items-center py-16">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-blue-600 font-bold">🏠</span>
              </div>
            </div>
          </div>
        )}

        {/* Map View */}
        {viewMode === 'map' && userLocation && !loading && (
          <div className="h-[700px] w-full mb-8 rounded-2xl overflow-hidden shadow-xl">
            <MapContainer center={[userLocation.lat, userLocation.lng]} zoom={13} className="h-full w-full">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[userLocation.lat, userLocation.lng]} icon={defaultIcon}>
                <Popup>
                  <div className="text-center p-2">
                    <strong className="text-blue-600">📍 Tu sei qui</strong>
                  </div>
                </Popup>
              </Marker>
              {listings.map((l) =>
                l.lat && l.lng ? (
                  <Marker key={l.id} position={[l.lat, l.lng]} icon={defaultIcon}>
                    <Popup>
                      <div className="min-w-[250px] p-2">
                        <img 
                          src={l.imageUrl ? `http://localhost:5000${l.imageUrl}` : "https://via.placeholder.com/200x100?text=No+Image"}
                          alt={l.title}
                          className="w-full h-24 object-cover rounded mb-2"
                        />
                        <h4 className="font-bold text-gray-800 mb-1">{l.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{l.city}</p>
                        <p className="text-lg font-bold text-blue-600 mb-2">€{l.price}/mese</p>
                        <Link
                          to={`/annuncio/${l.id}`}
                          className="inline-block w-full bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors text-center"
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
                <div key={listing.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group">
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(listing.id);
                      }}
                      className={`absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${
                        favorites.includes(listing.id) 
                          ? "bg-red-500 text-white shadow-xl scale-110" 
                          : "bg-white/90 text-gray-600 hover:text-red-500 hover:bg-white hover:scale-110"
                      }`}
                    >
                      <span className="text-lg">♥</span>
                    </button>
                    
                    <img
                      src={listing.imageUrl ? `http://localhost:5000${listing.imageUrl}` : "https://via.placeholder.com/400x250?text=No+Image"}
                      alt={listing.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-2 rounded-full backdrop-blur-sm">
                      <span className="text-sm font-medium">
                        {listing.type === 'stanza_singola' && '🛏️ Singola'}
                        {listing.type === 'stanza_doppia' && '🛏️🛏️ Doppia'}
                        {listing.type === 'intero_appartamento' && '🏠 Appartamento'}
                        {!listing.type && '🏠 Alloggio'}
                      </span>
                    </div>

                    {listing.university && (
                      <div className="absolute top-4 left-4 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                        🎓 {listing.university}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {listing.title}
                      </h3>
                      
                      <div className="flex items-center text-gray-600 mb-2">
                        <span className="mr-2">📍</span>
                        <span className="text-sm">{listing.city}</span>
                      </div>
                    </div>

                    {listing.services && listing.services.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {listing.services.slice(0, 3).map((service, index) => (
                          <span key={index} className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs">
                            {service}
                          </span>
                        ))}
                        {listing.services.length > 3 && (
                          <span className="text-blue-600 text-xs">+{listing.services.length - 3}</span>
                        )}
                      </div>
                    )}
                    
                    {listing.User && (
                      <div className="flex items-center text-gray-500 mb-3">
                        <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs mr-2">
                          {listing.User.nome?.[0]?.toUpperCase()}
                        </div>
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
                    
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <div>
                        <span className="text-3xl font-bold text-blue-600">€{listing.price}</span>
                        <span className="text-gray-500 text-sm">/mese</span>
                      </div>
                      
                      <Link
                        to={`/annuncio/${listing.id}`}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
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
              <div className="text-center py-20">
                <div className="text-8xl mb-6">🏠</div>
                <h3 className="text-3xl font-bold text-gray-800 mb-4">
                  Nessun alloggio trovato
                </h3>
                <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                  Prova a modificare i filtri di ricerca o espandi la tua area di interesse
                </p>
                <div className="flex justify-center space-x-4">
                  <button 
                    onClick={handleReset}
                    className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center"
                  >
                    <span className="mr-2">🔄</span>
                    Reset filtri
                  </button>
                  <Link
                    to="/crea"
                    className="bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 transition-colors font-medium flex items-center"
                  >
                    <span className="mr-2">➕</span>
                    Pubblica annuncio
                  </Link>
                </div>
              </div>
            )}

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-16">
                <div className="flex space-x-2 bg-white rounded-xl shadow-lg p-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 hover:text-blue-600"
                  >
                    ← Precedente
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        currentPage === i + 1 
                          ? "bg-blue-600 text-white shadow-md transform scale-105" 
                          : "text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 hover:text-blue-600"
                  >
                    Successiva →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
