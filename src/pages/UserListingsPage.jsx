import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function UserListingsPage() {
  const [listings, setListings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }

    const fetchUserListings = async () => {
      try {
        const res = await axios.get("http://localhost:3001/my-listings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setListings(res.data);
      } catch (err) {
        console.error("Errore nel caricamento degli annunci personali:", err);
      }
    };

    fetchUserListings();
  }, [navigate]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Sei sicuro di voler eliminare questo annuncio?")) return;
    try {
      await axios.delete(`http://localhost:3001/listings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setListings((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      alert("Errore nell'eliminazione dell'annuncio");
    }
  };

  const handleEdit = (id) => {
    navigate(`/modifica/${id}`);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">I tuoi annunci</h2>
      {listings.length === 0 ? (
        <p>Non hai ancora pubblicato nessun annuncio.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map((listing) => (
            <div key={listing.id} className="border p-4 rounded shadow relative">
              <img
                src={`http://localhost:3001${listing.imageUrl}`}
                alt="alloggio"
                className="w-full h-48 object-cover mb-2"
              />
              <h2 className="text-lg font-bold">{listing.title}</h2>
              <p>{listing.city} - {listing.address}</p>
              <p className="text-sm text-gray-600">€ {listing.price}</p>
              <div className="flex gap-2 mt-2">
                <button onClick={() => handleEdit(listing.id)} className="text-blue-600 underline text-sm">
                  Modifica
                </button>
                <button onClick={() => handleDelete(listing.id)} className="text-red-600 underline text-sm">
                  Elimina
                </button>
                <Link to={`/annuncio/${listing.id}`} className="text-green-600 underline text-sm">
                  Dettagli
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
