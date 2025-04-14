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

    // Decodifica token per ricavare userId dell'utente loggato
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.id);
    }
  }, [id]);

  if (!listing) return <p className="p-4">Caricamento annuncio...</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{listing.title}</h1>
      <img
        src={`http://localhost:3001${listing.imageUrl}`}
        alt="alloggio"
        className="w-full h-64 object-cover rounded mb-4"
      />
      <p className="text-lg">{listing.city}, {listing.address}</p>
      <p className="text-sm text-gray-600">Tipo: {listing.type}</p>
      <p className="text-xl font-semibold mt-2">€ {listing.price}</p>
      <p className="mt-2">Disponibile da: {listing.available_from}</p>
      <p className="mt-2">{listing.description}</p>
      <div className="text-sm text-gray-600 mt-2">Servizi: {listing.services.join(", ")}</div>

      {userId && userId !== listing.userId && (
        <ListingChat listingId={listing.id} receiverId={listing.userId} />
      )}
    </div>
  );
}