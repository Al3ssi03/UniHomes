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
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Messaggi ricevuti</h2>
      {messages.length === 0 ? (
        <p>Non hai nuovi messaggi.</p>
      ) : (
        <ul className="space-y-2">
          {messages.map((msg) => (
            <li key={msg.id} className="border p-3 rounded">
              <p className="mb-1">
                <strong>Annuncio #{msg.listingId}</strong>: {msg.content}
              </p>
              <Link
                to={`/annuncio/${msg.listingId}`}
                className="text-blue-600 underline text-sm"
              >
                Vai alla conversazione
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
