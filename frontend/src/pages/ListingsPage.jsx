// 📁 src/pages/ListingsPage.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">Cerca il tuo alloggio ideale</h1>

      <div className="mb-6 flex flex-col md:flex-row gap-4 flex-wrap justify-center">
        <input
          type="text"
          name="city"
          placeholder="Filtra per città"
          value={filters.city}
          onChange={handleFilterChange}
          className="border border-gray-300 p-2 rounded w-full md:w-56 shadow-sm"
        />
        <select
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
          className="border border-gray-300 p-2 rounded w-full md:w-56 shadow-sm"
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
          className="border border-gray-300 p-2 rounded w-full md:w-56 shadow-sm"
        />
        <input
          type="text"
          name="university"
          placeholder="Filtra per università"
          value={filters.university}
          onChange={handleFilterChange}
          className="border border-gray-300 p-2 rounded w-full md:w-56 shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedListings.map((listing) => (
          <div key={listing.id} className="bg-white border rounded-lg shadow hover:shadow-md transition p-4">
            <img
              src={`http://localhost:3001${listing.imageUrl}`}
              alt="alloggio"
              className="w-full h-48 object-cover rounded mb-2"
            />
            <h2 className="text-lg font-bold text-gray-800">{listing.title}</h2>
            <p className="text-sm text-gray-600">{listing.city} - {listing.address}</p>
            <p className="text-sm text-gray-500">{listing.type.replace("_", " ")}</p>
            <p className="text-lg font-semibold text-blue-600">€ {listing.price}</p>
            <p className="text-sm mt-1">Disponibile da: {listing.available_from}</p>
            {listing.university && <p className="text-sm mt-1 text-gray-600">Vicino a: {listing.university}</p>}
            <p className="text-xs text-gray-500 mt-2">Servizi: {listing.services.join(", ")}</p>
            <div className="mt-3">
              <Link to={`/annuncio/${listing.id}`} className="text-blue-700 underline text-sm">
                Vedi dettagli
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Paginazione */}
      <div className="flex justify-center mt-8 gap-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-3 py-1 border rounded ${currentPage === index + 1 ? "bg-blue-600 text-white" : "bg-white border-gray-300"}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}