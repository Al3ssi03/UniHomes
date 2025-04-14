// 📁 src/pages/LoginRegisterPage.jsx
import { useState } from "react";
import axios from "axios";

export default function LoginRegisterPage() {
  const [form, setForm] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("tenant");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form === "register") {
        await axios.post("http://localhost:3001/auth/register", { email, password, role });
        alert("Registrazione completata, ora effettua il login.");
        setForm("login");
      } else {
        const res = await axios.post("http://localhost:3001/auth/login", { email, password });
        localStorage.setItem("token", res.data.token);
        alert("Login effettuato con successo!");
        window.location.href = "/crea"; // reindirizza all'area riservata
      }
    } catch (err) {
      alert("Errore: " + err.response?.data?.message || "Errore generico");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 border p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">{form === "login" ? "Login" : "Registrazione"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2"
          required
        />
        {form === "register" && (
          <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full border p-2">
            <option value="tenant">Studente/Lavoratore</option>
            <option value="landlord">Proprietario</option>
          </select>
        )}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {form === "login" ? "Accedi" : "Registrati"}
        </button>
      </form>
      <p className="mt-4 text-sm text-center">
        {form === "login" ? "Non hai un account?" : "Hai già un account?"}
        <button onClick={() => setForm(form === "login" ? "register" : "login")} className="text-blue-600 ml-1">
          {form === "login" ? "Registrati" : "Accedi"}
        </button>
      </p>
    </div>
  );
}
