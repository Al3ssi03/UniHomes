// Enhanced LoginRegisterPage con diagnostica e gestione errori migliorata
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function EnhancedLoginRegisterPage() {
  const [form, setForm] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [annoNascita, setAnnoNascita] = useState("");
  const [telefono, setTelefono] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [backendStatus, setBackendStatus] = useState("checking");
  const navigate = useNavigate();

  // Verifica stato backend al caricamento
  useEffect(() => {
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/test", { timeout: 5000 });
      setBackendStatus("online");
      console.log("✅ Backend online:", response.data);
    } catch (err) {
      setBackendStatus("offline");
      console.log("❌ Backend offline:", err.message);
      setError("Backend non disponibile. Assicurati che il server sia avviato su http://localhost:5000");
    }
  };

  const validateForm = () => {
    if (!username.trim()) {
      setError("Username è obbligatorio");
      return false;
    }
    if (!password.trim() || password.length < 6) {
      setError("Password deve essere di almeno 6 caratteri");
      return false;
    }
    if (form === "register") {
      if (!nome.trim() || !cognome.trim()) {
        setError("Nome e cognome sono obbligatori");
        return false;
      }
      if (!annoNascita || annoNascita < 1900 || annoNascita > new Date().getFullYear()) {
        setError("Anno di nascita non valido");
        return false;
      }
      if (!telefono.trim()) {
        setError("Telefono è obbligatorio");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    if (backendStatus === "offline") {
      setError("Backend non disponibile. Impossibile procedere.");
      return;
    }

    setIsLoading(true);

    try {
      let response;
      
      if (form === "register") {
        console.log("🔄 Tentativo registrazione per:", username);
        response = await axios.post("http://localhost:5000/api/auth/register", {
          username,
          password,
          nome,
          cognome,
          anno_nascita: parseInt(annoNascita),
          telefono,
        }, { timeout: 10000 });
        
        console.log("✅ Registrazione riuscita:", response.data);
        setSuccess("Registrazione completata con successo!");
        
      } else {
        console.log("🔄 Tentativo login per:", username);
        response = await axios.post("http://localhost:5000/api/auth/login", {
          username,
          password,
        }, { timeout: 10000 });
        
        console.log("✅ Login riuscito:", response.data);
        setSuccess("Login completato con successo!");
      }

      // Salva i dati utente
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        // Reindirizza dopo un breve delay
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }

    } catch (err) {
      console.error("❌ Errore autenticazione:", err);
      
      if (err.code === 'ECONNREFUSED') {
        setError("Impossibile connettersi al server. Verifica che il backend sia attivo.");
      } else if (err.response) {
        setError(err.response.data?.message || "Errore dal server");
      } else if (err.request) {
        setError("Nessuna risposta dal server. Verifica la connessione.");
      } else {
        setError("Errore durante la richiesta: " + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setNome("");
    setCognome("");
    setAnnoNascita("");
    setTelefono("");
    setError("");
    setSuccess("");
  };

  const switchForm = (newForm) => {
    setForm(newForm);
    resetForm();
  };

  // Stili inline per garantire funzionamento anche senza CSS
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    },
    card: {
      background: 'white',
      borderRadius: '20px',
      padding: '40px',
      boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
      maxWidth: '500px',
      width: '100%'
    },
    title: {
      fontSize: '2rem',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '10px',
      color: '#1e40af'
    },
    subtitle: {
      textAlign: 'center',
      color: '#666',
      marginBottom: '30px'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '16px',
      marginBottom: '16px',
      transition: 'border-color 0.3s'
    },
    button: {
      width: '100%',
      padding: '12px',
      background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'transform 0.2s',
      marginBottom: '20px'
    },
    error: {
      background: '#fef2f2',
      border: '1px solid #fca5a5',
      color: '#dc2626',
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '16px',
      fontSize: '14px'
    },
    success: {
      background: '#f0fdf4',
      border: '1px solid #86efac',
      color: '#16a34a',
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '16px',
      fontSize: '14px'
    },
    status: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '20px',
      padding: '10px',
      borderRadius: '8px',
      fontSize: '14px'
    },
    statusOnline: {
      background: '#f0fdf4',
      color: '#16a34a',
      border: '1px solid #86efac'
    },
    statusOffline: {
      background: '#fef2f2',
      color: '#dc2626',
      border: '1px solid #fca5a5'
    },
    statusChecking: {
      background: '#fef3c7',
      color: '#d97706',
      border: '1px solid #fcd34d'
    }
  };

  const getStatusStyle = () => {
    if (backendStatus === "online") return { ...styles.status, ...styles.statusOnline };
    if (backendStatus === "offline") return { ...styles.status, ...styles.statusOffline };
    return { ...styles.status, ...styles.statusChecking };
  };

  const getStatusText = () => {
    if (backendStatus === "online") return "✅ Server Online";
    if (backendStatus === "offline") return "❌ Server Offline";
    return "🔄 Verifica server...";
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Stato Backend */}
        <div style={getStatusStyle()}>
          {getStatusText()}
          {backendStatus === "offline" && (
            <button
              onClick={checkBackendStatus}
              style={{ marginLeft: '10px', padding: '4px 8px', fontSize: '12px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Riprova
            </button>
          )}
        </div>

        {/* Header */}
        <h1 style={styles.title}>
          {form === "login" ? "🔐 Bentornato!" : "📝 Crea Account"}
        </h1>
        <p style={styles.subtitle}>
          {form === "login" ? "Accedi al tuo account AlloggiFinder" : "Registrati per iniziare"}
        </p>

        {/* Messaggi */}
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            disabled={isLoading || backendStatus === "offline"}
            required
          />

          <input
            type="password"
            placeholder="Password (min 6 caratteri)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            disabled={isLoading || backendStatus === "offline"}
            required
          />

          {form === "register" && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <input
                  type="text"
                  placeholder="Nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  style={styles.input}
                  disabled={isLoading || backendStatus === "offline"}
                  required
                />
                <input
                  type="text"
                  placeholder="Cognome"
                  value={cognome}
                  onChange={(e) => setCognome(e.target.value)}
                  style={styles.input}
                  disabled={isLoading || backendStatus === "offline"}
                  required
                />
              </div>

              <input
                type="number"
                placeholder="Anno di nascita (es: 1995)"
                value={annoNascita}
                onChange={(e) => setAnnoNascita(e.target.value)}
                style={styles.input}
                disabled={isLoading || backendStatus === "offline"}
                required
              />

              <input
                type="tel"
                placeholder="Telefono (es: 333 123 4567)"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                style={styles.input}
                disabled={isLoading || backendStatus === "offline"}
                required
              />
            </>
          )}

          <button
            type="submit"
            style={styles.button}
            disabled={isLoading || backendStatus === "offline"}
            onMouseOver={(e) => !e.target.disabled && (e.target.style.transform = 'translateY(-1px)')}
            onMouseOut={(e) => (e.target.style.transform = 'translateY(0)')}
          >
            {isLoading ? (
              form === "login" ? "🔄 Accesso..." : "🔄 Registrazione..."
            ) : (
              form === "login" ? "🔑 Accedi" : "📝 Registrati"
            )}
          </button>
        </form>

        {/* Switch Form */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#666', marginBottom: '10px' }}>
            {form === "login" ? "Non hai un account?" : "Hai già un account?"}
          </p>
          <button
            onClick={() => switchForm(form === "login" ? "register" : "login")}
            disabled={isLoading}
            style={{
              background: 'none',
              border: 'none',
              color: '#2563eb',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              textDecoration: 'underline'
            }}
          >
            {form === "login" ? "Registrati qui" : "Accedi qui"}
          </button>
        </div>

        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{ marginTop: '20px', padding: '10px', background: '#f3f4f6', borderRadius: '8px', fontSize: '12px', color: '#666' }}>
            <strong>Debug Info:</strong><br />
            Backend: {backendStatus}<br />
            API URL: http://localhost:5000/api/auth<br />
            Form: {form}
          </div>
        )}

        {/* Links */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link 
            to="/" 
            style={{ color: '#2563eb', textDecoration: 'none', fontSize: '14px' }}
          >
            ← Torna alla Home
          </Link>
        </div>
      </div>
    </div>
  );
}
