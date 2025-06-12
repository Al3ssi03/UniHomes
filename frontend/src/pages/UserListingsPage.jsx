// 📁 src/pages/UserListingsPage.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function UserListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, views: 0, messages: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/auth");
        return;
      }
      
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/announcements/user/my-announcements", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setListings(res.data);
        
        // Calculate stats
        setStats({
          total: res.data.length,
          views: res.data.reduce((total, listing) => total + (listing.views || 0), 0),
          messages: res.data.reduce((total, listing) => total + (listing.messages || 0), 0)
        });
      } catch (err) {
        console.error("Errore nel caricamento dei tuoi annunci:", err);
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate("/auth");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [navigate]);  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }
    
    if (!confirm("🗑️ Sei sicuro di voler eliminare questo annuncio? Questa azione non può essere annullata.")) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/announcements/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setListings((prev) => prev.filter((l) => l.id !== id));
      setStats(prevStats => ({ ...prevStats, total: prevStats.total - 1 }));
      alert("✅ Annuncio eliminato con successo!");
    } catch (err) {
      alert("❌ Errore nell'eliminazione dell'annuncio: " + (err.response?.data?.message || "Errore sconosciuto"));
    }
  };

  const getStatusBadge = (listing) => {
    // You can add logic here based on listing status, availability date, etc.
    const today = new Date();
    const availableDate = new Date(listing.disponibile_da);
    
    if (availableDate > today) {
      return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">📅 Futuro</span>;
    }
    return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">✅ Attivo</span>;
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">
            🏠 I tuoi annunci
          </h1>
          <p className="text-xl text-blue-100">
            Gestisci i tuoi alloggi e monitora le performance
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{stats.total}</div>
            <div className="text-gray-600">Annunci pubblicati</div>
            <div className="text-2xl mt-2">🏠</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{stats.views}</div>
            <div className="text-gray-600">Visualizzazioni totali</div>
            <div className="text-2xl mt-2">👀</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{stats.messages}</div>
            <div className="text-gray-600">Messaggi ricevuti</div>
            <div className="text-2xl mt-2">💌</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Link
            to="/pubblica"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-lg flex items-center"
          >
            <span className="mr-2">➕</span>
            Pubblica nuovo annuncio
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center"
          >
            <span className="mr-2">🔄</span>
            Aggiorna
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : listings.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Nessun annuncio pubblicato
            </h3>
            <p className="text-gray-600 mb-6">
              Inizia a guadagnare pubblicando il tuo primo alloggio!
            </p>
            <Link
              to="/pubblica"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium inline-block"
            >
              🚀 Pubblica il primo annuncio
            </Link>
          </div>
        ) : (
          /* Listings Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative">
                  <img
                    src={listing.immagini?.[0] ? `http://localhost:5000${listing.immagini[0]}` : "https://via.placeholder.com/400x250?text=No+Image"}
                    alt={listing.titolo}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    {getStatusBadge(listing)}
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-gray-800">
                      {listing.tipologia === 'stanza_singola' && '🛏️ Singola'}
                      {listing.tipologia === 'stanza_doppia' && '🛏️🛏️ Doppia'}
                      {listing.tipologia === 'intero_appartamento' && '🏠 Appartamento'}
                      {!listing.tipologia && '🏠 Alloggio'}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-gray-800 line-clamp-2 mb-2">
                      {listing.titolo}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <span className="mr-2">📍</span>
                      <span className="text-sm">{listing.città}</span>
                    </div>
                    <div className="flex items-center text-gray-500 mb-3">
                      <span className="mr-2">📅</span>
                      <span className="text-sm">
                        Dal {new Date(listing.disponibile_da).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">€{listing.prezzo}</span>
                      <span className="text-gray-500 text-sm">/mese</span>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>👀 {listing.views || 0} visualizzazioni</div>
                      <div>💌 {listing.messages || 0} messaggi</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link
                      to={`/annuncio/${listing.id}`}
                      className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-center text-sm font-medium"
                    >
                      👁️ Visualizza
                    </Link>
                    <button
                      onClick={() => navigate(`/modifica/${listing.id}`)}
                      className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium"
                    >
                      ✏️ Modifica
                    </button>
                    <button
                      onClick={() => handleDelete(listing.id)}
                      className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                    >
                      🗑️ Elimina
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
