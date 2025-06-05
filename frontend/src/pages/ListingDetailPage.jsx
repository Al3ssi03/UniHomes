// 📁 src/pages/ListingDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ListingChat from "../components/ListingChat";

export default function ListingDetailPage() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {

        const res = await axios.get(`http://localhost:5000/api/announcements/${id}`);
        const a = res.data;
        setListing({
          id: a.id,
          title: a.titolo,
          city: a.citt\u00e0,
          address: a.indirizzo,
          price: a.prezzo,
          type: a.tipologia || "",
          description: a.descrizione,
          services: [],
          imageUrl: a.immagini && a.immagini[0],
          available_from: a.disponibile_da,
          university: a.universit\u00e0,
          User: a.User,
        });

      } catch (err) {
        console.error("Errore nel recupero dell'annuncio:", err);
      }
    };
    fetchListing();
  }, [id]);

  if (!listing) return <p className="p-4">Caricamento annuncio...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">{listing.title}</h1>

      {listing.imageUrl && (
        <img
          src={`http://localhost:5000${listing.imageUrl}`}
          alt="Alloggio"
          className="w-full h-64 object-cover rounded mb-6 shadow"
        />
      )}

      <div className="space-y-2 text-gray-800">
        <p><strong>Città:</strong> {listing.city}</p>
        <p><strong>Indirizzo:</strong> {listing.address}</p>
        <p><strong>Tipo:</strong> {listing.type.replace("_", " ")}</p>
        <p><strong>Prezzo:</strong> € {listing.price}</p>
        <p><strong>Disponibile da:</strong> {listing.available_from}</p>
        {listing.university && <p><strong>Vicino a:</strong> {listing.university}</p>}
        <p className="text-sm text-gray-600"><strong>Servizi:</strong> {listing.services.join(", ")}</p>
        <p className="pt-2"><strong>Descrizione:</strong><br />{listing.description}</p>
        {listing.User && (
          <p className="text-sm text-gray-500 pt-4">Pubblicato da: {listing.User.nome} {listing.User.cognome}</p>
        )}
      </div>
      {listing.User && (
        <div className="mt-6">
          <ListingChat listingId={listing.id} receiverId={listing.User.id} />
        </div>
      )}
    </div>
  );
}
