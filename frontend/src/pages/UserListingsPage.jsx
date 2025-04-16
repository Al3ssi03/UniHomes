// 📁 src/pages/UserListingsPage.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UserListingsPage() {
  const [listings, setListings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await axios.get("http://localhost:3001/my-listings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setListings(res.data);
      } catch (err) {
        console.error("Errore nel caricamento dei tuoi annunci:", err);
      }
    };
    fetchListings();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.delete(`http://localhost:3001/listings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setListings((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      alert("Errore durante l'eliminazione dell'annuncio");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">I tuoi annunci</h2>
      {listings.length === 0 ? (
        <p className="text-gray-600">Nessun annuncio pubblicato.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div key={listing.id} className="bg-white shadow rounded-lg overflow-hidden">
              <img
                src={`http://localhost:3001${listing.imageUrl}`}
                alt={listing.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 space-y-2">
                <h3 className="text-lg font-semibold">{listing.title}</h3>
                <p className="text-sm text-gray-600">{listing.city}</p>
                <p className="text-blue-600 font-bold">€ {listing.price}</p>
                <div className="flex justify-between pt-2">
                  <button
                    onClick={() => navigate(`/modifica/${listing.id}`)}
                    className="text-sm text-white bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Modifica
                  </button>
                  <button
                    onClick={() => handleDelete(listing.id)}
                    className="text-sm text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                  >
                    Elimina
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
