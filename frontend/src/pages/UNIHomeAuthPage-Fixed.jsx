import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../App-UNIHome-Complete-Fixed.jsx";

// Design system per UNI Home Auth
const authTheme = {
  colors: {
    primary: '#6366f1',
    primaryDark: '#4f46e5',
    secondary: '#06b6d4',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    surface: 'rgba(255, 255, 255, 0.95)',
    surfaceGlass: 'rgba(255, 255, 255, 0.1)',
    text: '#1f2937',
    textLight: '#6b7280',
    white: '#ffffff'
  },
  shadows: {
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    glow: '0 0 30px rgba(99, 102, 241, 0.3)'
  }
};

const authStyles = {
  container: {
    minHeight: '100vh',
    background: authTheme.colors.background,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  card: {
    background: authTheme.colors.surface,
    borderRadius: '24px',
    padding: '48px',
    maxWidth: '480px',
    width: '100%',
    boxShadow: authTheme.shadows.xl,
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(20px)'
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px'
  },
  logo: {
    width: '64px',
    height: '64px',
    background: `linear-gradient(135deg, ${authTheme.colors.primary}, ${authTheme.colors.secondary})`,
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    margin: '0 auto 20px auto',
    boxShadow: authTheme.shadows.glow
  },
  title: {
    fontSize: '28px',
    fontWeight: '800',
    color: authTheme.colors.text,
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: '16px',
    color: authTheme.colors.textLight,
    marginBottom: '0'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: authTheme.colors.text,
    marginBottom: '0'
  },
  input: {
    width: '100%',
    padding: '16px 20px',
    fontSize: '16px',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    outline: 'none',
    transition: 'all 0.2s ease',
    backgroundColor: authTheme.colors.white,
    color: authTheme.colors.text
  },
  inputFocus: {
    borderColor: authTheme.colors.primary,
    boxShadow: `0 0 0 3px rgba(99, 102, 241, 0.1)`
  },
  inputError: {
    borderColor: authTheme.colors.error,
    boxShadow: `0 0 0 3px rgba(239, 68, 68, 0.1)`
  },
  inputDisabled: {
    backgroundColor: '#f9fafb',
    color: '#6b7280',
    cursor: 'not-allowed'
  },
  buttonPrimary: {
    width: '100%',
    background: `linear-gradient(135deg, ${authTheme.colors.primary}, ${authTheme.colors.primaryDark})`,
    color: authTheme.colors.white,
    border: 'none',
    padding: '16px 24px',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: authTheme.shadows.lg,
    position: 'relative',
    overflow: 'hidden'
  },
  buttonDisabled: {
    background: '#9ca3af',
    cursor: 'not-allowed',
    transform: 'none'
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '20px'
  },
  statusOnline: {
    background: '#d1fae5',
    color: '#065f46',
    border: '1px solid #a7f3d0'
  },
  statusOffline: {
    background: '#fee2e2',
    color: '#991b1b',
    border: '1px solid #fca5a5'
  },
  statusChecking: {
    background: '#dbeafe',
    color: '#1e40af',
    border: '1px solid #93c5fd'
  },
  alert: {
    padding: '16px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '20px'
  },
  alertError: {
    background: '#fee2e2',
    color: '#991b1b',
    border: '1px solid #fca5a5'
  },
  alertSuccess: {
    background: '#d1fae5',
    color: '#065f46',
    border: '1px solid #a7f3d0'
  },
  switchText: {
    textAlign: 'center',
    marginTop: '24px',
    fontSize: '14px',
    color: authTheme.colors.textLight
  },
  switchButton: {
    background: 'none',
    border: 'none',
    color: authTheme.colors.primary,
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'underline',
    marginLeft: '4px'
  },
  gridCols2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginRight: '8px'
  }
};

// Logo UNI Home per auth
function UNIHomeAuthLogo() {
  return (
    <div style={authStyles.logo}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M3 21L12 12L21 21H3Z" fill="currentColor" opacity="0.8"/>
        <path d="M12 3L3 12H21L12 3Z" fill="currentColor"/>
        <circle cx="12" cy="15" r="2" fill="rgba(255,255,255,0.9)"/>
      </svg>
    </div>
  );
}

export default function UNIHomeAuthPage() {
  const [form, setForm] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [email, setEmail] = useState("");
  const [annoNascita, setAnnoNascita] = useState("");
  const [telefono, setTelefono] = useState("");
  const [citta, setCitta] = useState("");
  const [provincia, setProvincia] = useState("");
  const [professione, setProfessione] = useState("");
  const [biografia, setBiografia] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [backendStatus, setBackendStatus] = useState("checking");
  const [focusedInput, setFocusedInput] = useState("");
  const navigate = useNavigate();
  const auth = useAuth();

  // Verifica stato backend
  useEffect(() => {
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/test", { timeout: 5000 });
      setBackendStatus("online");
      console.log("✅ Backend UNI Home online:", response.data);
    } catch (err) {
      setBackendStatus("offline");
      console.log("❌ Backend UNI Home offline:", err.message);
      setError("Server UNI Home non disponibile. Avvia il backend su porta 5000.");
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
      if (!email.trim() || !email.includes('@')) {
        setError("Email valida è obbligatoria");
        return false;
      }
      if (!annoNascita || annoNascita < 1950 || annoNascita > new Date().getFullYear() - 16) {
        setError("Anno di nascita non valido (devi avere almeno 16 anni)");
        return false;
      }
      if (!telefono.trim()) {
        setError("Numero di telefono è obbligatorio");
        return false;
      }
      if (!citta.trim()) {
        setError("Città è obbligatoria");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!validateForm()) return;
    if (backendStatus !== "online") {
      setError("Backend non disponibile. Impossibile procedere.");
      return;
    }

    setIsLoading(true);
    
    try {
      const endpoint = form === "login" ? "/api/auth/login" : "/api/auth/register";
      const data = form === "login" 
        ? { username, password }
        : { 
            username, 
            password, 
            nome, 
            cognome, 
            email,
            anno_nascita: parseInt(annoNascita), 
            telefono,
            citta,
            provincia: provincia || null,
            professione: professione || null,
            biografia: biografia || null
          };

      const response = await axios.post(`http://localhost:5000${endpoint}`, data, {
        timeout: 10000
      });

      // Salva dati utente con tutte le chiavi necessarie
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("userData", JSON.stringify(response.data.user));
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      setSuccess(form === "login" ? "Login effettuato con successo!" : "Registrazione completata!");
      
      // Usa il context di autenticazione
      if (auth && auth.login) {
        auth.login(response.data.user, response.data.token);
      }
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

    } catch (err) {
      console.error("Errore autenticazione:", err);
      
      if (err.code === 'ECONNREFUSED') {
        setError("Impossibile connettersi al server UNI Home. Verifica che sia avviato.");
      } else if (err.response?.status === 401) {
        setError("Credenziali non valide. Riprova.");
      } else if (err.response?.status === 400) {
        setError(err.response.data.message || "Dati non validi.");
      } else if (err.name === 'TimeoutError') {
        setError("Timeout connessione. Il server potrebbe essere sovraccarico.");
      } else {
        setError("Errore imprevisto. Riprova tra qualche minuto.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = () => {
    const statuses = {
      online: { style: authStyles.statusOnline, icon: "🟢", text: "Server UNI Home Online" },
      offline: { style: authStyles.statusOffline, icon: "🔴", text: "Server UNI Home Offline" },
      checking: { style: authStyles.statusChecking, icon: "🔄", text: "Verifica connessione..." }
    };
    
    const status = statuses[backendStatus];
    return (
      <div style={{...authStyles.statusBadge, ...status.style}}>
        <span>{status.icon}</span>
        <span>{status.text}</span>
      </div>
    );
  };

  const getInputStyle = (inputName, hasError = false) => ({
    ...authStyles.input,
    ...(focusedInput === inputName ? authStyles.inputFocus : {}),
    ...(hasError ? authStyles.inputError : {}),
    ...(isLoading || backendStatus !== "online" ? authStyles.inputDisabled : {})
  });

  return (
    <div style={authStyles.container}>
      <div style={authStyles.card}>
        <div style={authStyles.header}>
          <UNIHomeAuthLogo />
          <h1 style={authStyles.title}>
            {form === "login" ? "Bentornato su UNI Home" : "Unisciti a UNI Home"}
          </h1>
          <p style={authStyles.subtitle}>
            {form === "login" 
              ? "Accedi al tuo account per continuare" 
              : "Crea il tuo account e trova la casa perfetta"}
          </p>
        </div>

        {getStatusBadge()}

        {error && (
          <div style={{...authStyles.alert, ...authStyles.alertError}}>
            ❌ {error}
          </div>
        )}

        {success && (
          <div style={{...authStyles.alert, ...authStyles.alertSuccess}}>
            ✅ {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={authStyles.form}>
          <div style={authStyles.inputGroup}>
            <label style={authStyles.label}>Username</label>
            <input
              type="text"
              placeholder="Il tuo username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setFocusedInput("username")}
              onBlur={() => setFocusedInput("")}
              style={getInputStyle("username")}
              required
              disabled={isLoading || backendStatus !== "online"}
            />
          </div>

          <div style={authStyles.inputGroup}>
            <label style={authStyles.label}>Password</label>
            <input
              type="password"
              placeholder="La tua password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedInput("password")}
              onBlur={() => setFocusedInput("")}
              style={getInputStyle("password")}
              required
              disabled={isLoading || backendStatus !== "online"}
            />
          </div>

          {form === "register" && (
            <>
              <div style={authStyles.gridCols2}>
                <div style={authStyles.inputGroup}>
                  <label style={authStyles.label}>Nome</label>
                  <input
                    type="text"
                    placeholder="Nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    onFocus={() => setFocusedInput("nome")}
                    onBlur={() => setFocusedInput("")}
                    style={getInputStyle("nome")}
                    required
                    disabled={isLoading || backendStatus !== "online"}
                  />
                </div>
                <div style={authStyles.inputGroup}>
                  <label style={authStyles.label}>Cognome</label>
                  <input
                    type="text"
                    placeholder="Cognome"
                    value={cognome}
                    onChange={(e) => setCognome(e.target.value)}
                    onFocus={() => setFocusedInput("cognome")}
                    onBlur={() => setFocusedInput("")}
                    style={getInputStyle("cognome")}
                    required
                    disabled={isLoading || backendStatus !== "online"}
                  />
                </div>
              </div>

              <div style={authStyles.inputGroup}>
                <label style={authStyles.label}>Anno di Nascita</label>
                <input
                  type="number"
                  placeholder="es. 2000"
                  value={annoNascita}
                  onChange={(e) => setAnnoNascita(e.target.value)}
                  onFocus={() => setFocusedInput("annoNascita")}
                  onBlur={() => setFocusedInput("")}
                  style={getInputStyle("annoNascita")}
                  min="1950"
                  max={new Date().getFullYear() - 16}
                  required
                  disabled={isLoading || backendStatus !== "online"}
                />
              </div>

              <div style={authStyles.inputGroup}>
                <label style={authStyles.label}>Telefono</label>
                <input
                  type="tel"
                  placeholder="es. 333 123 4567"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  onFocus={() => setFocusedInput("telefono")}
                  onBlur={() => setFocusedInput("")}
                  style={getInputStyle("telefono")}
                  required
                  disabled={isLoading || backendStatus !== "online"}
                />
              </div>

              <div style={authStyles.inputGroup}>
                <label style={authStyles.label}>Email</label>
                <input
                  type="email"
                  placeholder="tua.email@esempio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedInput("email")}
                  onBlur={() => setFocusedInput("")}
                  style={getInputStyle("email")}
                  required
                  disabled={isLoading || backendStatus !== "online"}
                />
              </div>

              <div style={authStyles.gridCols2}>
                <div style={authStyles.inputGroup}>
                  <label style={authStyles.label}>Città</label>
                  <input
                    type="text"
                    placeholder="es. Milano"
                    value={citta}
                    onChange={(e) => setCitta(e.target.value)}
                    onFocus={() => setFocusedInput("citta")}
                    onBlur={() => setFocusedInput("")}
                    style={getInputStyle("citta")}
                    required
                    disabled={isLoading || backendStatus !== "online"}
                  />
                </div>
                <div style={authStyles.inputGroup}>
                  <label style={authStyles.label}>Provincia (opzionale)</label>
                  <input
                    type="text"
                    placeholder="es. MI"
                    value={provincia}
                    onChange={(e) => setProvincia(e.target.value)}
                    onFocus={() => setFocusedInput("provincia")}
                    onBlur={() => setFocusedInput("")}
                    style={getInputStyle("provincia")}
                    disabled={isLoading || backendStatus !== "online"}
                  />
                </div>
              </div>

              <div style={authStyles.inputGroup}>
                <label style={authStyles.label}>Professione (opzionale)</label>
                <input
                  type="text"
                  placeholder="es. Studente, Lavoratore, Dottorando..."
                  value={professione}
                  onChange={(e) => setProfessione(e.target.value)}
                  onFocus={() => setFocusedInput("professione")}
                  onBlur={() => setFocusedInput("")}
                  style={getInputStyle("professione")}
                  disabled={isLoading || backendStatus !== "online"}
                />
              </div>

              <div style={authStyles.inputGroup}>
                <label style={authStyles.label}>Biografia (opzionale)</label>
                <textarea
                  placeholder="Parlaci un po' di te... (massimo 200 caratteri)"
                  value={biografia}
                  onChange={(e) => setBiografia(e.target.value.slice(0, 200))}
                  onFocus={() => setFocusedInput("biografia")}
                  onBlur={() => setFocusedInput("")}
                  style={{
                    ...getInputStyle("biografia"),
                    minHeight: '80px',
                    resize: 'vertical'
                  }}
                  rows="3"
                  maxLength="200"
                  disabled={isLoading || backendStatus !== "online"}
                />
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                  {biografia.length}/200 caratteri
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            style={{
              ...authStyles.buttonPrimary,
              ...(isLoading || backendStatus !== "online" ? authStyles.buttonDisabled : {})
            }}
            disabled={isLoading || backendStatus !== "online"}
            onMouseEnter={(e) => {
              if (!isLoading && backendStatus === "online") {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = authTheme.shadows.xl;
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading && backendStatus === "online") {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = authTheme.shadows.lg;
              }
            }}
          >
            {isLoading && (
              <div style={authStyles.spinner}></div>
            )}
            {isLoading 
              ? (form === "login" ? "Accesso..." : "Registrazione...") 
              : (form === "login" ? "Accedi a UNI Home" : "Crea Account UNI Home")
            }
          </button>
        </form>

        <div style={authStyles.switchText}>
          {form === "login" ? "Non hai ancora un account?" : "Hai già un account?"}
          <button
            style={authStyles.switchButton}
            onClick={() => {
              setForm(form === "login" ? "register" : "login");
              setError("");
              setSuccess("");
            }}
            disabled={isLoading}
          >
            {form === "login" ? "Registrati qui" : "Accedi qui"}
          </button>
        </div>
      </div>

      {/* CSS per animazioni */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
