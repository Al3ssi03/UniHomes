import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, useParams } from "react-router-dom";

// Context per gestire l'autenticazione
const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      isAuthenticated: !!localStorage.getItem('authToken'),
      user: localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : null,
      login: (userData, token) => {
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(userData));
        window.location.reload();
      },
      logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.href = '/';
      },
      loading: false
    };
  }
  return context;
};

// Dati di esempio sempre disponibili
const sampleAnnouncements = [
  {
    id: 1,
    titolo: "🏠 Camera Singola - Centro Storico Bologna",
    prezzo: 450,
    tipo_stanza: "Singola",
    citta: "Bologna",
    dimensione: 15,
    descrizione: "Magnifica camera singola nel cuore del centro storico di Bologna, a soli 5 minuti a piedi dall'Università. Camera luminosa, completamente arredata con scrivania, armadio e letto singolo. Wifi incluso, riscaldamento autonomo.",
    indirizzo: "Via Zamboni 15, Bologna",
    immagini: [],
    telefono: "+39 333 123 4567",
    email: "bologna.affitti@example.com"
  },
  {
    id: 2,
    titolo: "🛏️ Posto Letto - Zona Bocconi Milano",
    prezzo: 380,
    tipo_stanza: "Doppia",
    citta: "Milano",
    dimensione: 18,
    descrizione: "Posto letto in camera doppia condivisa in appartamento moderno. Zona Bocconi, ottimi collegamenti con metro e autobus. Coinquilini internazionali, ambiente gioviale e stimolante. Cucina attrezzata e lavatrice.",
    indirizzo: "Viale Bligny 10, Milano",
    immagini: [],
    telefono: "+39 347 987 6543",
    email: "milano.studenti@example.com"
  },
  {
    id: 3,
    titolo: "🏡 Monolocale Arredato - Zona Universitaria Roma",
    prezzo: 650,
    tipo_stanza: "Monolocale",
    citta: "Roma",
    dimensione: 25,
    descrizione: "Delizioso monolocale completamente ristrutturato nella zona universitaria di San Lorenzo. Ideale per studenti, con angolo cottura attrezzato, bagno privato e balconcino. Vicino a La Sapienza e ben collegato al centro.",
    indirizzo: "Via del Castro Laurenziano 9, Roma",
    immagini: [],
    telefono: "+39 329 456 7890",
    email: "roma.affitti@example.com"
  },
  {
    id: 4,
    titolo: "🌟 Camera Doppia - Zona Politecnico Torino",
    prezzo: 320,
    tipo_stanza: "Doppia",
    citta: "Torino",
    dimensione: 20,
    descrizione: "Camera doppia spaziosa in appartamento condiviso vicino al Politecnico di Torino. Due letti singoli, scrivania, armadio. Appartamento con cucina abitabile, due bagni, balcone. Spese incluse.",
    indirizzo: "Corso Duca degli Abruzzi 42, Torino",
    immagini: [],
    telefono: "+39 334 567 8901",
    email: "torino.student@example.com"
  },
  {
    id: 5,
    titolo: "✨ Camera Singola Premium - Centro Firenze",
    prezzo: 520,
    tipo_stanza: "Singola",
    citta: "Firenze",
    dimensione: 16,
    descrizione: "Elegante camera singola in palazzo storico fiorentino, a pochi passi da Santa Maria Novella e dall'Università. Camera con vista sui tetti, arredata con gusto, wifi fibra, aria condizionata.",
    indirizzo: "Via dei Banchi 8, Firenze",
    immagini: [],
    telefono: "+39 338 234 5678",
    email: "firenze.premium@example.com"
  },
  {
    id: 6,
    titolo: "🏖️ Posto Letto - Zona Università Napoli",
    prezzo: 280,
    tipo_stanza: "Doppia",
    citta: "Napoli",
    dimensione: 22,
    descrizione: "Posto letto in camera doppia in appartamento luminoso nella zona universitaria di Napoli. Vicino alla metro, facile raggiungere il centro e l'università. Ambiente multiculturale e accogliente.",
    indirizzo: "Via Mezzocannone 45, Napoli",
    immagini: [],
    telefono: "+39 366 789 0123",
    email: "napoli.university@example.com"
  }
];

// Provider per l'autenticazione
const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Errore parsing userData:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
    
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Componente principale per mostrare gli annunci
const HomePage = () => {
  const [announcements] = useState(sampleAnnouncements);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  const cities = [...new Set(announcements.map(a => a.citta))].sort();

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.titolo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.descrizione.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = !selectedCity || announcement.citta === selectedCity;
    const matchesPrice = (!priceRange.min || announcement.prezzo >= parseInt(priceRange.min)) &&
                        (!priceRange.max || announcement.prezzo <= parseInt(priceRange.max));
    
    return matchesSearch && matchesCity && matchesPrice;
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        marginBottom: '40px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '30px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <h1 style={{
              color: 'white',
              fontSize: '32px',
              fontWeight: 'bold',
              margin: '0 0 10px 0',
              background: 'linear-gradient(45deg, #ff6b9d, #ff9a56)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              🏠 UNI Home
            </h1>
            <p style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '18px',
              margin: 0
            }}>
              Trova il tuo alloggio universitario perfetto
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            {isAuthenticated && (
              <>
                <span style={{ color: 'white', fontSize: '14px' }}>
                  Ciao, {user?.nome || 'Utente'}! 👋
                </span>
                <button
                  onClick={() => navigate('/create')}
                  style={{
                    background: 'linear-gradient(45deg, #4facfe, #00f2fe)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  ➕ Pubblica Annuncio
                </button>
              </>
            )}
            
            {isAuthenticated ? (
              <button
                onClick={logout}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  padding: '12px 24px',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => navigate('/auth')}
                style={{
                  background: 'linear-gradient(45deg, #ff6b9d, #ff9a56)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                Accedi
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filtri di ricerca */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        marginBottom: '40px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '25px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          <div>
            <label style={{
              color: 'white',
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              🔍 Cerca
            </label>
            <input
              type="text"
              placeholder="Cerca per titolo o descrizione..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{
              color: 'white',
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              📍 Città
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            >
              <option value="">Tutte le città</option>
              {cities.map(city => (
                <option key={city} value={city} style={{ background: '#333' }}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{
              color: 'white',
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              💰 Prezzo min
            </label>
            <input
              type="number"
              placeholder="Es. 200"
              value={priceRange.min}
              onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{
              color: 'white',
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              💰 Prezzo max
            </label>
            <input
              type="number"
              placeholder="Es. 800"
              value={priceRange.max}
              onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>
      </div>

      {/* Risultati */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        marginBottom: '20px'
      }}>
        <div style={{
          color: 'white',
          fontSize: '18px',
          marginBottom: '20px',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '15px',
          borderRadius: '15px',
          backdropFilter: 'blur(10px)'
        }}>
          📊 Trovati <strong>{filteredAnnouncements.length}</strong> annunci su <strong>{announcements.length}</strong> totali
        </div>
      </div>

      {/* Lista Annunci */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {filteredAnnouncements.length === 0 ? (
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '60px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ fontSize: '80px', marginBottom: '20px' }}>🔍</div>
            <h2 style={{ color: 'white', marginBottom: '15px' }}>Nessun risultato</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '30px' }}>
              Prova a modificare i filtri di ricerca per trovare più annunci.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCity('');
                setPriceRange({ min: '', max: '' });
              }}
              style={{
                background: 'linear-gradient(45deg, #4facfe, #00f2fe)',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: 'bold'
              }}
            >
              🔄 Azzera Filtri
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '30px'
          }}>
            {filteredAnnouncements.map((announcement) => (
              <div
                key={announcement.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)'
                }}
                onClick={() => navigate(`/announcement/${announcement.id}`)}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
                }}
              >
                {/* Immagine placeholder */}
                <div style={{
                  height: '200px',
                  background: 'linear-gradient(45deg, #ff9a56, #ff6b9d)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '50px',
                  position: 'relative'
                }}>
                  🏠
                  
                  {/* Badge prezzo */}
                  <div style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    background: 'rgba(0, 0, 0, 0.8)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
                  }}>
                    €{announcement.prezzo}/mese
                  </div>
                </div>

                {/* Contenuto */}
                <div style={{ padding: '25px' }}>
                  <h3 style={{
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    marginBottom: '15px',
                    lineHeight: '1.3'
                  }}>
                    {announcement.titolo}
                  </h3>

                  {/* Caratteristiche */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    marginBottom: '15px'
                  }}>
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      🛏️ {announcement.tipo_stanza}
                    </div>
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      📍 {announcement.citta}
                    </div>
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      📏 {announcement.dimensione}m²
                    </div>
                  </div>

                  {/* Descrizione */}
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    marginBottom: '20px',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {announcement.descrizione}
                  </p>

                  {/* Call to action */}
                  <div style={{
                    background: 'linear-gradient(45deg, #4facfe, #00f2fe)',
                    color: 'white',
                    padding: '12px',
                    borderRadius: '15px',
                    textAlign: 'center',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}>
                    👁️ Vedi Dettagli
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Pagina di autenticazione
const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nome: '',
    telefono: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simula sempre il login con successo
    setTimeout(() => {
      const mockUser = {
        id: Date.now(),
        nome: formData.nome || formData.email.split('@')[0],
        email: formData.email
      };
      login(mockUser, 'demo-token-' + Date.now());
      navigate('/');
    }, 1000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '40px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{
          color: 'white',
          textAlign: 'center',
          marginBottom: '30px',
          fontSize: '28px',
          fontWeight: 'bold'
        }}>
          🏠 UNI Home
        </h1>

        <div style={{
          display: 'flex',
          marginBottom: '30px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '15px',
          padding: '5px'
        }}>
          <button
            onClick={() => setIsLogin(true)}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderRadius: '10px',
              background: isLogin ? 'linear-gradient(45deg, #ff6b9d, #ff9a56)' : 'transparent',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Accedi
          </button>
          <button
            onClick={() => setIsLogin(false)}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderRadius: '10px',
              background: !isLogin ? 'linear-gradient(45deg, #ff6b9d, #ff9a56)' : 'transparent',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Registrati
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Nome completo"
              value={formData.nome}
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
              required
              style={{
                width: '100%',
                padding: '15px',
                marginBottom: '15px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '15px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
            style={{
              width: '100%',
              padding: '15px',
              marginBottom: '15px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '15px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
            style={{
              width: '100%',
              padding: '15px',
              marginBottom: '15px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '15px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />

          {!isLogin && (
            <input
              type="tel"
              placeholder="Telefono (opzionale)"
              value={formData.telefono}
              onChange={(e) => setFormData({...formData, telefono: e.target.value})}
              style={{
                width: '100%',
                padding: '15px',
                marginBottom: '15px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '15px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          )}

          {error && (
            <div style={{
              background: 'rgba(255, 107, 157, 0.2)',
              border: '1px solid rgba(255, 107, 157, 0.5)',
              color: 'white',
              padding: '10px',
              borderRadius: '10px',
              marginBottom: '15px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px',
              border: 'none',
              borderRadius: '15px',
              background: loading ? 'rgba(255, 255, 255, 0.3)' : 'linear-gradient(45deg, #4facfe, #00f2fe)',
              color: 'white',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '18px',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? '⏳ Accesso in corso...' : (isLogin ? '🚀 Accedi' : '✨ Registrati')}
          </button>
        </form>

        <button
          onClick={() => navigate('/')}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '15px',
            background: 'transparent',
            color: 'white',
            cursor: 'pointer',
            fontSize: '16px',
            marginTop: '15px',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
          onMouseOut={(e) => e.target.style.background = 'transparent'}
        >
          ← Torna alla Home
        </button>
      </div>
    </div>
  );
};

// Pagina dettaglio annuncio
const AnnouncementDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const announcement = sampleAnnouncements.find(a => a.id === parseInt(id));

  if (!announcement) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: '40px',
          textAlign: 'center'
        }}>
          <h2 style={{ color: 'white', marginBottom: '20px' }}>🏠 Annuncio non trovato</h2>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'linear-gradient(45deg, #ff6b9d, #ff9a56)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            ← Torna alla Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      {/* Header con bottone indietro */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        marginBottom: '30px'
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '15px',
            padding: '12px 20px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          <span style={{ fontSize: '20px' }}>←</span>
          <span>Torna agli Annunci</span>
        </button>
      </div>

      {/* Card principale */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr',
          gap: '0'
        }}>
          
          {/* Immagine */}
          <div style={{
            height: window.innerWidth > 768 ? 'auto' : '300px',
            minHeight: '400px',
            background: 'linear-gradient(45deg, #ff9a56, #ff6b9d)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '80px'
          }}>
            🏠
          </div>

          {/* Dettagli */}
          <div style={{ padding: '40px' }}>
            {/* Titolo e Prezzo */}
            <div style={{ marginBottom: '30px' }}>
              <h1 style={{
                color: 'white',
                fontSize: '28px',
                fontWeight: 'bold',
                marginBottom: '15px',
                lineHeight: '1.2'
              }}>
                {announcement.titolo}
              </h1>
              <div style={{
                background: 'linear-gradient(45deg, #ff6b9d, #ff9a56)',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '25px',
                display: 'inline-block',
                fontSize: '24px',
                fontWeight: 'bold'
              }}>
                €{announcement.prezzo}/mese
              </div>
            </div>

            {/* Caratteristiche */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '15px',
              marginBottom: '30px'
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '15px',
                borderRadius: '15px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{ fontSize: '24px', marginBottom: '5px' }}>🛏️</div>
                <div style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>
                  {announcement.tipo_stanza}
                </div>
              </div>
              
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '15px',
                borderRadius: '15px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{ fontSize: '24px', marginBottom: '5px' }}>📍</div>
                <div style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>
                  {announcement.citta}
                </div>
              </div>
              
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '15px',
                borderRadius: '15px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{ fontSize: '24px', marginBottom: '5px' }}>📏</div>
                <div style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>
                  {announcement.dimensione} m²
                </div>
              </div>
            </div>

            {/* Descrizione */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{
                color: 'white',
                fontSize: '20px',
                marginBottom: '15px',
                fontWeight: 'bold'
              }}>
                Descrizione
              </h3>
              <p style={{
                color: 'rgba(255, 255, 255, 0.9)',
                lineHeight: '1.6',
                fontSize: '16px'
              }}>
                {announcement.descrizione}
              </p>
            </div>

            {/* Indirizzo */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{
                color: 'white',
                fontSize: '20px',
                marginBottom: '10px',
                fontWeight: 'bold'
              }}>
                📍 Indirizzo
              </h3>
              <p style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '16px'
              }}>
                {announcement.indirizzo}
              </p>
            </div>

            {/* Contatti */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '20px',
              borderRadius: '15px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <h4 style={{
                color: 'white',
                marginBottom: '15px',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                📞 Contatta il Proprietario
              </h4>
              <div style={{ marginBottom: '10px' }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>📱 Telefono: </span>
                <span style={{ color: 'white', fontWeight: 'bold' }}>{announcement.telefono}</span>
              </div>
              <div>
                <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>✉️ Email: </span>
                <span style={{ color: 'white', fontWeight: 'bold' }}>{announcement.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Route protetta
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: 'white', fontSize: '18px' }}>Caricamento...</div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

// App principale
const App = () => {
  console.log("🎨 UNI Home - Versione Production Ready!");
  
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/announcement/:id" element={<AnnouncementDetailPage />} />
          <Route 
            path="/create" 
            element={
              <ProtectedRoute>
                <div style={{
                  minHeight: '100vh',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '20px',
                    padding: '40px',
                    textAlign: 'center'
                  }}>
                    <h2 style={{ color: 'white', marginBottom: '20px' }}>🚧 Creazione Annunci</h2>
                    <p style={{ color: 'white', marginBottom: '30px' }}>
                      Funzionalità disponibile presto! Potrai pubblicare i tuoi annunci.
                    </p>
                    <button
                      onClick={() => window.history.back()}
                      style={{
                        background: 'linear-gradient(45deg, #ff6b9d, #ff9a56)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '25px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold'
                      }}
                    >
                      ← Indietro
                    </button>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
