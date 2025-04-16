// 📁 src/pages/ForgotPasswordPage.jsx
import { useState } from "react";
import axios from "axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3001/forgot-password", { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage("Errore: " + (err.response?.data?.message || "Impossibile inviare l'email"));
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white border shadow rounded mt-10">
      <h2 className="text-xl font-bold text-blue-700 mb-4 text-center">Recupera Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Inserisci la tua email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Invia link di reset
        </button>
      </form>
      {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
    </div>
  );
}
