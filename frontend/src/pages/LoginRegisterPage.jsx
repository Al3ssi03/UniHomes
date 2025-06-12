// 📁 src/pages/LoginRegisterPage.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginRegisterPage() {
  const [form, setForm] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [annoNascita, setAnnoNascita] = useState("");
  const [telefono, setTelefono] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (form === "register") {
        const res = await axios.post("http://localhost:5000/api/auth/register", {
          username,
          password,
          nome,
          cognome,
          anno_nascita: parseInt(annoNascita),
          telefono,
        });
        
        // Salva il token e i dati utente
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.userId);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        
        alert("Registrazione completata con successo!");
        navigate("/");
      } else {
        const res = await axios.post("http://localhost:5000/api/auth/login", {
          username,
          password,
        });
        
        // Salva il token e i dati utente
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.userId);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Errore durante l'operazione");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {form === "login" ? "Bentornato!" : "Crea Account"}
          </h2>
          <p className="text-gray-600">
            {form === "login" ? "Accedi al tuo account" : "Registrati per iniziare"}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              type="text"
              placeholder="Inserisci il tuo username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required 
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              placeholder="Inserisci la tua password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
              disabled={isLoading}
            />
          </div>

          {form === "register" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                  <input
                    type="text"
                    placeholder="Nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cognome</label>
                  <input
                    type="text"
                    placeholder="Cognome"
                    value={cognome}
                    onChange={(e) => setCognome(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Anno di nascita</label>
                <input
                  type="number"
                  placeholder="Es: 1995"
                  value={annoNascita}
                  onChange={(e) => setAnnoNascita(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefono</label>
                <input
                  type="text"
                  placeholder="Es: 333 123 4567"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                  disabled={isLoading}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {form === "login" ? "Accesso..." : "Registrazione..."}
              </div>
            ) : (
              form === "login" ? "Accedi" : "Registrati"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {form === "login" ? "Non hai un account?" : "Hai già un account?"}
            <button
              onClick={() => {
                setForm(form === "login" ? "register" : "login");
                setError("");
              }}
              className="text-blue-600 font-medium ml-2 hover:text-blue-800 transition-colors"
              disabled={isLoading}
            >
              {form === "login" ? "Registrati qui" : "Accedi qui"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
