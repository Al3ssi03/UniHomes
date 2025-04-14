import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);

    if (token) {
      axios
        .get("http://localhost:3001/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setNotificationCount(res.data.length);
        })
        .catch((err) => {
          console.error("Errore nel recupero notifiche:", err);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    navigate("/auth");
  };

  return (
    <nav className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
      <Link to="/" className="font-bold text-xl">
        AlloggiFinder
      </Link>
      <div className="space-x-4 flex items-center">
        {loggedIn && notificationCount > 0 && (
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {notificationCount} 🔔
          </span>
        )}
        {loggedIn ? (
          <>
            <Link to="/crea">Pubblica Annuncio</Link>
            <Link to="/i-miei-annunci">I miei annunci</Link>
            <button onClick={handleLogout} className="underline">
              Logout
            </button>
          </>
        ) : (
          <Link to="/auth">Login / Registrati</Link>
        )}
      </div>
    </nav>
  );
}