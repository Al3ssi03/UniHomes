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
    <div className="border rounded p-4 max-w-md mx-auto mt-6">
      <h3 className="text-lg font-bold mb-2">Chat Annuncio #{listingId}</h3>
      <div className="max-h-64 overflow-y-auto border p-2 mb-2 bg-gray-50">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-1">
            <span className="font-semibold">{msg.senderId === receiverId ? "Loro" : "Tu"}:</span> {msg.content}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border p-2"
          placeholder="Scrivi un messaggio..."
        />
        <button onClick={handleSend} className="bg-blue-600 text-white px-4 py-2 rounded">
          Invia
        </button>
      </div>
    </div>
  );
}