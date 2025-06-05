// 📁 src/pages/LoginRegisterPage.jsx
import { useState } from "react";
import axios from "axios";

export default function LoginRegisterPage() {
  const [form, setForm] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [annoNascita, setAnnoNascita] = useState("");
  const [telefono, setTelefono] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form === "register") {
        await axios.post("http://localhost:5000/api/auth/register", {
          username,
          password,
          nome,
          cognome,
          anno_nascita: annoNascita,
          telefono,
        });
        alert("Registrazione completata, ora effettua il login.");
        setForm("login");
      } else {
        const res = await axios.post("http://localhost:5000/api/auth/login", {
          username,
          password,
        });
        localStorage.setItem("userId", res.data.userId);
        alert("Login effettuato con successo!");
        window.location.href = "/";
      }
    } catch (err) {
      alert("Errore: " + (err.response?.data?.message || "Errore generico"));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 border p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">{form === "login" ? "Login" : "Registrazione"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
          <>
            <input
              type="text"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full border p-2"
              required
            />
            <input
              type="text"
              placeholder="Cognome"
              value={cognome}
              onChange={(e) => setCognome(e.target.value)}
              className="w-full border p-2"
              required
            />
            <input
              type="number"
              placeholder="Anno di nascita"
              value={annoNascita}
              onChange={(e) => setAnnoNascita(e.target.value)}
              className="w-full border p-2"
              required
            />
            <input
              type="text"
              placeholder="Telefono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full border p-2"
              required
            />
          </>
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
