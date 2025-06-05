// 📁 src/pages/InboxPage.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function InboxPage() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;
      try {
        const res = await axios.get("http://localhost:5000/api/messages/conversations", {
          headers: { "user-id": userId },
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
            <li key={msg.partnerId} className="bg-white border border-gray-200 p-4 rounded shadow hover:shadow-md transition">
              <p className="text-gray-800">
                Conversazione con {msg.partner.nome} {msg.partner.cognome}
              </p>
              {msg.lastMessage && (
                <p className="text-sm text-gray-500 mt-1">Ultimo messaggio: {msg.lastMessage.contenuto}</p>
              )}
              <div className="mt-2 text-sm text-gray-600">Messaggi non letti: {msg.unreadCount}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}