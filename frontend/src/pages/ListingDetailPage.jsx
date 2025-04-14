// 📁 src/pages/ListingDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ListingChat from "../components/ListingChat";

export default function ListingDetailPage() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/listings/${id}`);
        setListing(res.data);
      } catch (err) {
        console.error("Errore nel caricamento dell'annuncio:", err);
      }
    };
    fetchListing();

    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.id);
    }
  }, [id]);

  if (!listing) return <p className="p-4">Caricamento annuncio...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">{listing.title}</h1>

      <img
        src={`http://localhost:3001${listing.imageUrl}`}
        alt="alloggio"
        className="w-full h-64 object-cover rounded mb-6 shadow"
      />

      <div className="space-y-2 text-gray-800">
        <p><strong>Città:</strong> {listing.city}</p>
        <p><strong>Indirizzo:</strong> {listing.address}</p>
        <p><strong>Tipo:</strong> {listing.type.replace("_", " ")}</p>
        <p><strong>Prezzo:</strong> € {listing.price}</p>
        <p><strong>Disponibile da:</strong> {listing.available_from}</p>
        {listing.university && <p><strong>Vicino a:</strong> {listing.university}</p>}
        <p className="text-sm text-gray-600"><strong>Servizi:</strong> {listing.services.join(", ")}</p>
        <p className="pt-2"><strong>Descrizione:</strong><br />{listing.description}</p>
      </div>

      {userId && userId !== listing.userId && (
        <div className="mt-8">
          <ListingChat listingId={listing.id} receiverId={listing.userId} />
        </div>
      )}
    </div>
  );
}