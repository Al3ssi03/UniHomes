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
    <nav className="bg-white border-b border-gray-200 shadow-sm py-3 px-6 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-700">
        AlloggiFinder
      </Link>

      <div className="flex gap-4 items-center">
        {loggedIn && (
          <>
            <Link to="/crea" className="text-sm text-gray-700 hover:text-blue-600">Pubblica</Link>
            <Link to="/i-miei-annunci" className="text-sm text-gray-700 hover:text-blue-600">I miei annunci</Link>
            <Link to="/inbox" className="relative text-sm text-gray-700 hover:text-blue-600">
              Messaggi
              {notificationCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full px-1">
                  {notificationCount}
                </span>
              )}
            </Link>
            <button onClick={handleLogout} className="text-sm text-red-600 hover:underline">
              Logout
            </button>
          </>
        )}
        {!loggedIn && (
          <Link to="/auth" className="text-sm text-blue-600 hover:underline">Login / Registrati</Link>
        )}
      </div>
    </nav>
  );
}