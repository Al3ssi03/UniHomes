import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router-dom";

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

// Componente per mostrare gli annunci
const AnnouncementsListPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/announcements');
      
      if (!response.ok) {
        throw new Error(`Errore ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setAnnouncements(data);
    } catch (err) {
      console.error('Errore nel caricamento degli annunci:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '40px',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTop: '4px solid #fff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ color: 'white', fontSize: '18px', margin: 0 }}>
            Caricamento annunci...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
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
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '40px',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>😔</div>
          <h2 style={{ color: 'white', marginBottom: '15px' }}>Errore</h2>
          <p style={{ color: 'white', marginBottom: '30px' }}>{error}</p>
          <button
            onClick={fetchAnnouncements}
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
            Riprova
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
          
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            {isAuthenticated && (
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

      {/* Lista Annunci */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {announcements.length === 0 ? (
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '60px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ fontSize: '80px', marginBottom: '20px' }}>🏠</div>
            <h2 style={{ color: 'white', marginBottom: '15px' }}>Nessun annuncio disponibile</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '30px' }}>
              Sii il primo a pubblicare un annuncio!
            </p>
            {isAuthenticated && (
              <button
                onClick={() => navigate('/create')}
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
                ➕ Pubblica il primo annuncio
              </button>
            )}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '30px'
          }}>
            {announcements.map((announcement) => (
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
                {/* Immagine */}
                <div style={{ position: 'relative', height: '200px' }}>
                  {announcement.immagini && announcement.immagini.length > 0 ? (
                    <img
                      src={`http://localhost:5000${announcement.immagini[0]}`}
                      alt={announcement.titolo}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.style.background = 'linear-gradient(45deg, #ff9a56, #ff6b9d)';
                        e.target.parentElement.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: white; font-size: 40px;">🏠</div>';
                      }}
                    />
                  ) : (
                    <div style={{
                      height: '100%',
                      background: 'linear-gradient(45deg, #ff9a56, #ff6b9d)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '40px'
                    }}>
                      🏠
                    </div>
                  )}
                  
                  {/* Badge prezzo */}
                  <div style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    background: 'linear-gradient(45deg, #ff6b9d, #ff9a56)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                  }}>
                    €{announcement.prezzo}/mese
                  </div>
                </div>

                {/* Contenuto */}
                <div style={{ padding: '25px' }}>
                  <h3 style={{
                    color: 'white',
                    fontSize: '20px',
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
                    gap: '10px',
                    marginBottom: '15px'
                  }}>
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      padding: '6px 12px',
                      borderRadius: '15px',
                      fontSize: '14px',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      🛏️ {announcement.tipo_stanza}
                    </div>
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      padding: '6px 12px',
                      borderRadius: '15px',
                      fontSize: '14px',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      📍 {announcement.citta}
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
                    {announcement.descrizione || 'Nessuna descrizione disponibile.'}
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

      {/* CSS Animations */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

// Pagina di autenticazione semplificata
const SimpleAuthPage = () => {
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

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Errore durante l\'operazione');
      }

      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
              placeholder="Telefono"
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
            {loading ? '⏳ Attendere...' : (isLogin ? 'Accedi' : 'Registrati')}
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
  console.log("🎨 App UNI Home avviata!");
  
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AnnouncementsListPage />} />
          <Route path="/auth" element={<SimpleAuthPage />} />
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
                    <h2 style={{ color: 'white', marginBottom: '20px' }}>🚧 In Sviluppo</h2>
                    <p style={{ color: 'white', marginBottom: '30px' }}>
                      La pagina di creazione annunci sarà disponibile presto!
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
          <Route 
            path="/announcement/:id" 
            element={
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
                  <h2 style={{ color: 'white', marginBottom: '20px' }}>🚧 In Sviluppo</h2>
                  <p style={{ color: 'white', marginBottom: '30px' }}>
                    La pagina di dettaglio annunci sarà disponibile presto!
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
            } 
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
