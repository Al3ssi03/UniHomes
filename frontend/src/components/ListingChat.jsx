// 📁 src/components/ListingChat.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function ListingChat({ listingId, receiverId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/messages/${listingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
      } catch (err) {
        console.error("Errore nel recupero messaggi:", err);
      }
    };
    fetchMessages();
  }, [listingId]);

  const handleSend = async () => {
    const token = localStorage.getItem("token");
    if (!newMessage.trim()) return;
    try {
      const res = await axios.post(
        "http://localhost:3001/messages",
        {
          listingId,
          receiverId,
          content: newMessage,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch (err) {
      alert("Errore nell'invio del messaggio");
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg bg-white shadow p-4 max-w-xl mx-auto">
      <h3 className="text-xl font-semibold text-blue-700 mb-3">💬 Chat sull'annuncio</h3>
      <div className="max-h-64 overflow-y-auto mb-4 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded-lg text-sm max-w-xs ${
              msg.senderId === receiverId
                ? "bg-gray-100 text-left"
                : "bg-blue-100 text-right ml-auto"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border border-gray-300 p-2 rounded"
          placeholder="Scrivi un messaggio..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Invia
        </button>
      </div>
    </div>
  );
}