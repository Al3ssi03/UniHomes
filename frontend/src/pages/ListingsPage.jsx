// 📁 src/pages/ListingsPage.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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
      const query = new URLSearchParams();

      if (filters.city) query.append("citta", filters.city);
      if (filters.maxPrice) query.append("prezzoMax", filters.maxPrice);
      if (filters.type) query.append("tipologia", filters.type);
      const res = await axios.get(`http://localhost:5000/api/announcements?${query.toString()}`);
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
      }

      setListings(data);
      setCurrentPage(1);
    } catch (err) {
      console.error("Errore nel caricamento degli annunci:", err);
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

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">Cerca il tuo alloggio ideale</h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
        <input
          type="text"
          placeholder="Filtra per città"
          value={filters.city}
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          className="border p-2 rounded"
        />
        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">Tutti i tipi</option>
          <option value="stanza_singola">Stanza singola</option>
          <option value="stanza_doppia">Stanza doppia</option>
          <option value="intero_appartamento">Intero appartamento</option>
        </select>
        <input
          type="number"
          placeholder="Prezzo massimo"
          value={filters.maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Filtra per università"
          value={filters.university}
          onChange={(e) => setFilters({ ...filters, university: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Distanza massima (km)"
          value={filters.maxDistance}
          onChange={(e) => setFilters({ ...filters, maxDistance: e.target.value })}
          className="border p-2 rounded"
        />
      </div>

      <div className="flex justify-end mb-6">
        <button onClick={handleReset} className="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200">
          Reset filtri
        </button>
      </div>

      {userLocation && (
        <div className="h-[300px] w-full mb-6">
          <MapContainer center={[userLocation.lat, userLocation.lng]} zoom={13} className="h-full w-full rounded shadow">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[userLocation.lat, userLocation.lng]} icon={defaultIcon}>
              <Popup>Tu sei qui</Popup>
            </Marker>
            {listings.map((l) =>
              l.lat && l.lng ? (
                <Marker key={l.id} position={[l.lat, l.lng]} icon={defaultIcon}>
                  <Popup>{l.title}</Popup>
                </Marker>
              ) : null
            )}
          </MapContainer>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedListings.map((listing) => (
          <Link to={`/annuncio/${listing.id}`} key={listing.id} className="bg-white shadow rounded-lg overflow-hidden transition hover:shadow-md relative block">
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleFavorite(listing.id);
              }}
              className={`absolute top-2 right-2 text-xl z-10 ${favorites.includes(listing.id) ? "text-red-500" : "text-gray-400 hover:text-red-400"}`}
            >
              ♥
            </button>
            <img
              src={`http://localhost:5000${listing.imageUrl}`}
              alt="Annuncio"
              className="w-full h-48 object-cover"
            />
            <div className="p-4 space-y-1">
              <h3 className="text-lg font-bold text-gray-800">{listing.title}</h3>
              <p className="text-sm text-gray-600">{listing.city} - €{listing.price}/mese</p>
              {listing.User && (
                <p className="text-xs text-gray-500">Pubblicato da: {listing.User.nome} {listing.User.cognome}</p>
              )}
              {userLocation && listing.lat && listing.lng && (
                <p className="text-xs text-gray-400">
                  📍 A circa {Math.round(haversineDistance(userLocation, { lat: listing.lat, lng: listing.lng }))} km da te
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded border ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-white text-blue-600 hover:bg-blue-50"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
