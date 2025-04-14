// 📁 src/pages/ListingsPage.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function ListingsPage() {
  const [listings, setListings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({ city: "", type: "", maxPrice: "", university: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await axios.get("http://localhost:3001/listings");
        setListings(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error("Errore nel caricamento degli annunci:", err);
      }
    };
    fetchListings();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    const filteredResults = listings.filter((listing) => {
      return (
        (newFilters.city === "" || listing.city.toLowerCase().includes(newFilters.city.toLowerCase())) &&
        (newFilters.type === "" || listing.type === newFilters.type) &&
        (newFilters.maxPrice === "" || listing.price <= parseFloat(newFilters.maxPrice)) &&
        (newFilters.university === "" || (listing.university && listing.university.toLowerCase().includes(newFilters.university.toLowerCase())))
      );
    });

    setFiltered(filteredResults);
    setCurrentPage(1);
  };

  const paginatedListings = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="p-4">
      <div className="mb-4 flex flex-col md:flex-row gap-2 flex-wrap">
        <input
          type="text"
          name="city"
          placeholder="Filtra per città"
          value={filters.city}
          onChange={handleFilterChange}
          className="border p-2 w-full md:w-1/4"
        />
        <select
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
          className="border p-2 w-full md:w-1/4"
        >
          <option value="">Tutti i tipi</option>
          <option value="stanza_singola">Stanza singola</option>
          <option value="stanza_doppia">Stanza doppia</option>
          <option value="intero_appartamento">Intero appartamento</option>
        </select>
        <input
          type="number"
          name="maxPrice"
          placeholder="Prezzo massimo"
          value={filters.maxPrice}
          onChange={handleFilterChange}
          className="border p-2 w-full md:w-1/4"
        />
        <input
          type="text"
          name="university"
          placeholder="Filtra per università"
          value={filters.university}
          onChange={handleFilterChange}
          className="border p-2 w-full md:w-1/4"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedListings.map((listing) => (
          <div key={listing.id} className="border p-4 rounded shadow">
            <img
              src={`http://localhost:3001${listing.imageUrl}`}
              alt="alloggio"
              className="w-full h-48 object-cover mb-2"
            />
            <h2 className="text-xl font-bold">{listing.title}</h2>
            <p>{listing.city} - {listing.address}</p>
            <p className="text-sm text-gray-600">{listing.type.replace("_", " ")}</p>
            <p className="text-lg font-semibold">€ {listing.price}</p>
            <p className="text-sm mt-1">Disponibile da: {listing.available_from}</p>
            {listing.university && <p className="text-sm mt-1">Vicino a: {listing.university}</p>}
            <div className="text-xs text-gray-500 mt-2">
              Servizi: {listing.services.join(", ")}
            </div>
          </div>
        ))}
      </div>

      {/* Paginazione */}
      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-3 py-1 border rounded ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-white"}`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Mappa */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-2">Mappa degli annunci</h2>
        <MapContainer center={[41.9028, 12.4964]} zoom={6} scrollWheelZoom={false} className="h-96 w-full rounded">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filtered.map((listing) => (
            listing.lat && listing.lng && (
              <Marker key={listing.id} position={[listing.lat, listing.lng]}>
                <Popup>
                  <strong>{listing.title}</strong><br />
                  {listing.city} - €{listing.price}
                </Popup>
              </Marker>
            )
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
