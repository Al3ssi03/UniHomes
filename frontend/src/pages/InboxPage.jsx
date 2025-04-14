// 📁 src/pages/InboxPage.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function InboxPage() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await axios.get("http://localhost:3001/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
      } catch (err) {
        console.error("Errore nel recupero messaggi non letti:", err);
      }
    };
    fetchMessages();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen bg-gray-50">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">📥 I tuoi messaggi</h2>

      {messages.length === 0 ? (
        <p className="text-center text-gray-600">Non hai nuovi messaggi.</p>
      ) : (
        <ul className="space-y-4">
          {messages.map((msg) => (
            <li key={msg.id} className="bg-white border border-gray-200 p-4 rounded shadow hover:shadow-md transition">
              <p className="text-gray-800">
                <span className="font-semibold">Annuncio #{msg.listingId}</span>: {msg.content}
              </p>
              <p className="text-sm text-gray-500 mt-1">Ricevuto il: {new Date(msg.timestamp).toLocaleString()}</p>
              <div className="mt-2">
                <Link
                  to={`/annuncio/${msg.listingId}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Apri conversazione ↗
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}