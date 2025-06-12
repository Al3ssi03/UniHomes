// App.jsx completa - Versione progressiva
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import CreateAnnouncement from './components/CreateAnnouncement';
import InboxPage from './components/InboxPage';
import UserDashboard from './components/UserDashboard';
import AnnouncementDetail from './components/AnnouncementDetail';
import Navbar from './components/Navbar';
import ToastContainer, { showToast } from './components/ToastContainer';

// Componenti semplificati per iniziare
function HomePage() {
    const navigate = useNavigate();
    
    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                {/* Header */}
                <header style={{
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '20px',
                    padding: '30px',
                    marginBottom: '30px',
                    textAlign: 'center',
                    color: 'white'
                }}>
                    <h1 style={{
                        fontSize: '3.5rem',
                        marginBottom: '20px',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                    }}>
                        🏠 AlloggiFinder
                    </h1>
                    <p style={{ fontSize: '1.3rem', opacity: 0.9 }}>
                        Piattaforma completa per la ricerca di alloggi
                    </p>
                </header>

                {/* Navigazione principale */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '25px',
                    marginBottom: '40px'
                }}>
                    <Link to="/listings" style={{ textDecoration: 'none' }}>
                        <div style={{
                            background: 'rgba(76, 175, 80, 0.9)',
                            padding: '30px',
                            borderRadius: '20px',
                            color: 'white',
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.3)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🏠</div>
                            <h2 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>Cerca Alloggi</h2>
                            <p style={{ opacity: 0.9 }}>Trova il tuo alloggio ideale tra centinaia di annunci</p>
                        </div>
                    </Link>

                    <Link to="/auth" style={{ textDecoration: 'none' }}>
                        <div style={{
                            background: 'rgba(33, 150, 243, 0.9)',
                            padding: '30px',
                            borderRadius: '20px',
                            color: 'white',
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.3)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🔐</div>
                            <h2 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>Accedi</h2>
                            <p style={{ opacity: 0.9 }}>Entra nel tuo account o registrati gratuitamente</p>
                        </div>
                    </Link>

                    <Link to="/crea" style={{ textDecoration: 'none' }}>
                        <div style={{
                            background: 'rgba(255, 152, 0, 0.9)',
                            padding: '30px',
                            borderRadius: '20px',
                            color: 'white',
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.3)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>➕</div>
                            <h2 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>Pubblica</h2>
                            <p style={{ opacity: 0.9 }}>Crea un nuovo annuncio per il tuo alloggio</p>
                        </div>
                    </Link>                    <Link to="/inbox" style={{ textDecoration: 'none' }}>
                        <div style={{
                            background: 'rgba(156, 39, 176, 0.9)',
                            padding: '30px',
                            borderRadius: '20px',
                            color: 'white',
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.3)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>💬</div>
                            <h2 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>Messaggi</h2>
                            <p style={{ opacity: 0.9 }}>Gestisci le tue conversazioni</p>
                        </div>
                    </Link>

                    <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                        <div style={{
                            background: 'rgba(233, 30, 99, 0.9)',
                            padding: '30px',
                            borderRadius: '20px',
                            color: 'white',
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.3)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>👤</div>
                            <h2 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>Dashboard</h2>
                            <p style={{ opacity: 0.9 }}>Profilo e gestione annunci</p>
                        </div>
                    </Link>
                </div>

                {/* Sezione caratteristiche */}
                <div style={{
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '20px',
                    padding: '40px',
                    color: 'white'
                }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '2.5rem' }}>
                        ✨ Perché scegliere AlloggiFinder?
                    </h2>
                    
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '30px'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔍</div>
                            <h3 style={{ marginBottom: '15px' }}>Ricerca Avanzata</h3>
                            <p style={{ opacity: 0.8 }}>Filtri dettagliati per prezzo, zona, tipo di alloggio e servizi inclusi</p>
                        </div>
                        
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>💬</div>
                            <h3 style={{ marginBottom: '15px' }}>Chat Integrata</h3>
                            <p style={{ opacity: 0.8 }}>Comunica direttamente con proprietari e inquilini</p>
                        </div>
                        
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🛡️</div>
                            <h3 style={{ marginBottom: '15px' }}>Sicurezza</h3>
                            <p style={{ opacity: 0.8 }}>Profili verificati e sistema di recensioni</p>
                        </div>
                        
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📱</div>
                            <h3 style={{ marginBottom: '15px' }}>Mobile First</h3>
                            <p style={{ opacity: 0.8 }}>Ottimizzato per smartphone e tablet</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Pagina annunci con connessione backend
function ListingsPage() {
    const [listings, setListings] = React.useState([]);
    const [filteredListings, setFilteredListings] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [filters, setFilters] = React.useState({
        città: '',
        prezzoMin: '',
        prezzoMax: ''
    });
    const navigate = useNavigate();// Funzione per iniziare una conversazione
    const handleContact = async (listing) => {
        const token = localStorage.getItem('token');
        if (!token) {
            showToast('Devi effettuare il login per contattare gli utenti', 'warning');
            navigate('/auth');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    receiverId: listing.userId,
                    content: `Ciao! Sono interessato al tuo annuncio "${listing.titolo}". Puoi darmi maggiori informazioni?`
                })
            });

            if (response.ok) {
                showToast('Messaggio inviato! Controlla la tua inbox per continuare la conversazione.', 'success');
                navigate('/inbox');
            } else {
                const data = await response.json();
                showToast(`Errore: ${data.message}`, 'error');
            }
        } catch (error) {
            console.error('Errore invio messaggio:', error);
            showToast('Errore di connessione', 'error');
        }
    };    React.useEffect(() => {
        // Carica annunci dal backend
        fetch('http://localhost:5000/api/announcements')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('📡 Annunci caricati:', data);
                setListings(data);
                setFilteredListings(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('❌ Errore caricamento annunci:', error);
                setError(error.message);
                setLoading(false);
            });
    }, []);

    // Applica filtri quando cambiano
    React.useEffect(() => {
        let filtered = listings.filter(listing => {
            const matchesSearch = !searchTerm || 
                listing.titolo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                listing.descrizione.toLowerCase().includes(searchTerm.toLowerCase()) ||
                listing.città.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCity = !filters.città || 
                listing.città.toLowerCase().includes(filters.città.toLowerCase());

            const matchesMinPrice = !filters.prezzoMin || 
                listing.prezzo >= parseInt(filters.prezzoMin);

            const matchesMaxPrice = !filters.prezzoMax || 
                listing.prezzo <= parseInt(filters.prezzoMax);

            return matchesSearch && matchesCity && matchesMinPrice && matchesMaxPrice;
        });

        setFilteredListings(filtered);
    }, [listings, searchTerm, filters]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const clearFilters = () => {
        setSearchTerm('');
        setFilters({
            città: '',
            prezzoMin: '',
            prezzoMax: ''
        });
    };

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                minHeight: '100vh', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                color: 'white' 
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🔄</div>
                    <h2>Caricamento annunci...</h2>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ 
                padding: '40px', 
                textAlign: 'center', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                minHeight: '100vh', 
                color: 'white' 
            }}>
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <h1>❌ Errore di Connessione</h1>
                    <p style={{ fontSize: '18px', marginBottom: '20px' }}>
                        Impossibile caricare gli annunci: {error}
                    </p>
                    <p style={{ marginBottom: '30px', opacity: 0.8 }}>
                        Assicurati che il server backend sia attivo sulla porta 5000
                    </p>
                    <button 
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '15px 30px',
                            fontSize: '16px',
                            background: 'rgba(255,255,255,0.2)',
                            border: '2px solid rgba(255,255,255,0.3)',
                            borderRadius: '10px',
                            color: 'white',
                            cursor: 'pointer',
                            marginRight: '15px'
                        }}
                    >
                        🔄 Riprova
                    </button>
                    <Link to="/" style={{ 
                        display: 'inline-block',
                        padding: '15px 30px',
                        background: 'rgba(40, 167, 69, 0.8)',
                        color: 'white', 
                        textDecoration: 'none',
                        borderRadius: '10px'
                    }}>
                        ← Torna alla Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            minHeight: '100vh',
            padding: '20px'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>                {/* Header */}
                <div style={{
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '20px',
                    padding: '30px',
                    marginBottom: '30px',
                    textAlign: 'center',
                    color: 'white'
                }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
                        🏠 Annunci Disponibili
                    </h1>
                    <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
                        {filteredListings.length} {filteredListings.length === 1 ? 'annuncio trovato' : 'annunci trovati'}
                        {listings.length !== filteredListings.length && ` di ${listings.length} totali`}
                    </p>
                    <Link to="/" style={{ 
                        color: 'white', 
                        textDecoration: 'none',
                        fontSize: '16px',
                        opacity: 0.8
                    }}>
                        ← Torna alla Home
                    </Link>
                </div>

                {/* Filtri di ricerca */}
                <div style={{
                    background: 'rgba(255,255,255,0.95)',
                    borderRadius: '20px',
                    padding: '25px',
                    marginBottom: '30px',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                }}>
                    <h3 style={{ color: '#333', marginBottom: '20px', fontSize: '1.3rem' }}>
                        🔍 Cerca e Filtra
                    </h3>
                    
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '15px',
                        marginBottom: '15px'
                    }}>
                        {/* Ricerca generale */}
                        <input
                            type="text"
                            placeholder="Cerca per titolo, descrizione o città..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                padding: '12px',
                                border: '2px solid #e1e5e9',
                                borderRadius: '10px',
                                fontSize: '14px',
                                transition: 'border-color 0.3s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                        />

                        {/* Filtro città */}
                        <input
                            type="text"
                            placeholder="Città..."
                            value={filters.città}
                            onChange={(e) => handleFilterChange('città', e.target.value)}
                            style={{
                                padding: '12px',
                                border: '2px solid #e1e5e9',
                                borderRadius: '10px',
                                fontSize: '14px',
                                transition: 'border-color 0.3s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                        />

                        {/* Prezzo minimo */}
                        <input
                            type="number"
                            placeholder="Prezzo min (€)"
                            value={filters.prezzoMin}
                            onChange={(e) => handleFilterChange('prezzoMin', e.target.value)}
                            style={{
                                padding: '12px',
                                border: '2px solid #e1e5e9',
                                borderRadius: '10px',
                                fontSize: '14px',
                                transition: 'border-color 0.3s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                        />

                        {/* Prezzo massimo */}
                        <input
                            type="number"
                            placeholder="Prezzo max (€)"
                            value={filters.prezzoMax}
                            onChange={(e) => handleFilterChange('prezzoMax', e.target.value)}
                            style={{
                                padding: '12px',
                                border: '2px solid #e1e5e9',
                                borderRadius: '10px',
                                fontSize: '14px',
                                transition: 'border-color 0.3s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                        />
                    </div>

                    {/* Pulsante reset filtri */}
                    {(searchTerm || filters.città || filters.prezzoMin || filters.prezzoMax) && (
                        <button
                            onClick={clearFilters}
                            style={{
                                padding: '8px 16px',
                                background: 'rgba(244, 67, 54, 0.1)',
                                color: '#f44336',
                                border: '1px solid rgba(244, 67, 54, 0.3)',
                                borderRadius: '8px',
                                fontSize: '14px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = '#f44336';
                                e.target.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'rgba(244, 67, 54, 0.1)';
                                e.target.style.color = '#f44336';
                            }}
                        >
                            🗑️ Cancella Filtri
                        </button>
                    )}
                </div>                {/* Lista annunci */}
                {filteredListings.length === 0 ? (
                    <div style={{
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '20px',
                        padding: '60px',
                        textAlign: 'center',
                        color: 'white'
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>
                            {listings.length === 0 ? '🏡' : '🔍'}
                        </div>
                        <h2>
                            {listings.length === 0 ? 'Nessun annuncio disponibile' : 'Nessun risultato trovato'}
                        </h2>
                        <p style={{ opacity: 0.8, marginBottom: '30px' }}>
                            {listings.length === 0 ? 
                                'Sii il primo a pubblicare un annuncio!' :
                                'Prova a modificare i filtri di ricerca'
                            }
                        </p>
                        {listings.length === 0 ? (
                            <Link to="/crea" style={{
                                display: 'inline-block',
                                padding: '15px 30px',
                                background: 'rgba(255, 152, 0, 0.9)',
                                color: 'white',
                                textDecoration: 'none',
                                borderRadius: '10px',
                                fontSize: '16px'
                            }}>
                                ➕ Pubblica il primo annuncio
                            </Link>
                        ) : (
                            <button
                                onClick={clearFilters}
                                style={{
                                    padding: '15px 30px',
                                    background: 'rgba(102, 126, 234, 0.9)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    fontSize: '16px',
                                    cursor: 'pointer'
                                }}
                            >
                                🗑️ Cancella Filtri
                            </button>
                        )}
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                        gap: '25px'
                    }}>
                        {filteredListings.map(listing => (
                            <div key={listing.id} style={{
                                background: 'rgba(255,255,255,0.95)',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.3)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
                            }}>                                {/* Immagine placeholder */}
                                <div style={{
                                    height: '200px',
                                    background: listing.immagini && listing.immagini.length > 0 ? 
                                        'transparent' : 'linear-gradient(45deg, #ff9a56, #ff6b9d)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '4rem',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    {listing.immagini && listing.immagini.length > 0 ? (
                                        <img 
                                            src={`http://localhost:5000${listing.immagini[0]}`}
                                            alt={listing.titolo}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.parentElement.style.background = 'linear-gradient(45deg, #ff9a56, #ff6b9d)';
                                                e.target.parentElement.innerHTML = '<div style="font-size: 4rem;">🏠</div>';
                                            }}
                                        />
                                    ) : (
                                        '🏠'
                                    )}
                                    
                                    {/* Badge numero immagini */}
                                    {listing.immagini && listing.immagini.length > 1 && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '10px',
                                            left: '10px',
                                            background: 'rgba(0,0,0,0.7)',
                                            color: 'white',
                                            padding: '4px 8px',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            fontWeight: 'bold'
                                        }}>
                                            📷 {listing.immagini.length}
                                        </div>
                                    )}
                                </div>

                                {/* Contenuto */}
                                <div style={{ padding: '25px' }}>
                                    <h3 style={{ 
                                        color: '#333', 
                                        marginBottom: '10px',
                                        fontSize: '1.4rem'
                                    }}>
                                        {listing.titolo}
                                    </h3>
                                    
                                    <p style={{ 
                                        color: '#666', 
                                        marginBottom: '15px',
                                        lineHeight: '1.5'
                                    }}>
                                        {listing.descrizione.length > 100 
                                            ? listing.descrizione.substring(0, 100) + '...'
                                            : listing.descrizione
                                        }
                                    </p>                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '15px'
                                    }}>
                                        <div style={{
                                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                            color: 'white',
                                            padding: '8px 16px',
                                            borderRadius: '20px',
                                            fontSize: '1.2rem',
                                            fontWeight: 'bold'
                                        }}>
                                            €{listing.prezzo}/mese
                                        </div>

                                        <div style={{ color: '#666', fontSize: '14px' }}>
                                            📍 {listing.città}
                                        </div>
                                    </div>

                                    {/* Info aggiuntive */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '15px',
                                        padding: '8px 0',
                                        borderTop: '1px solid #eee',
                                        fontSize: '12px',
                                        color: '#888'
                                    }}>
                                        <span>
                                            👤 {listing.User ? `${listing.User.nome} ${listing.User.cognome}` : 'Proprietario'}
                                        </span>
                                        <span>
                                            📅 {new Date(listing.createdAt).toLocaleDateString('it-IT')}
                                        </span>
                                    </div><div style={{
                                        display: 'flex',
                                        gap: '10px'
                                    }}>
                                        <button 
                                            onClick={() => handleContact(listing)}
                                            style={{
                                            flex: 1,
                                            padding: '12px',
                                            background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '10px',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: '500'
                                        }}>
                                            📞 Contatta
                                        </button>
                                          <button 
                                            onClick={() => navigate(`/annuncio/${listing.id}`)}
                                            style={{
                                            flex: 1,
                                            padding: '12px',
                                            background: 'rgba(102, 126, 234, 0.1)',
                                            color: '#667eea',
                                            border: '2px solid #667eea',
                                            borderRadius: '10px',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: '500'
                                        }}>
                                            👁️ Dettagli
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function AuthPage() {
    const [isLogin, setIsLogin] = React.useState(true);
    const [formData, setFormData] = React.useState({
        username: '',
        password: '',
        nome: '',
        cognome: '',
        telefono: ''
    });
    const [loading, setLoading] = React.useState(false);
    const [message, setMessage] = React.useState('');

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const url = isLogin ? 
                'http://localhost:5000/api/auth/login' : 
                'http://localhost:5000/api/auth/register';

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(`✅ ${isLogin ? 'Login' : 'Registrazione'} effettuato con successo!`);
                if (isLogin && data.token) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1500);
                }
            } else {
                setMessage(`❌ ${data.message || 'Errore durante l\'operazione'}`);
            }
        } catch (error) {
            console.error('Errore:', error);
            setMessage('❌ Errore di connessione al server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div style={{
                background: 'rgba(255,255,255,0.95)',
                borderRadius: '20px',
                padding: '40px',
                maxWidth: '500px',
                width: '100%',
                boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 style={{ color: '#333', fontSize: '2.5rem', marginBottom: '10px' }}>
                        {isLogin ? '🔐 Accedi' : '📝 Registrati'}
                    </h1>
                    <p style={{ color: '#666', fontSize: '16px' }}>
                        {isLogin ? 'Benvenuto di nuovo!' : 'Crea un nuovo account'}
                    </p>
                    <Link to="/" style={{ 
                        color: '#667eea', 
                        textDecoration: 'none',
                        fontSize: '14px'
                    }}>
                        ← Torna alla Home
                    </Link>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '8px', 
                            color: '#333',
                            fontWeight: '500'
                        }}>
                            Username / Email
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '2px solid #e1e5e9',
                                borderRadius: '10px',
                                fontSize: '16px',
                                transition: 'border-color 0.3s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                            placeholder={isLogin ? "mario.rossi" : "Il tuo username"}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '8px', 
                            color: '#333',
                            fontWeight: '500'
                        }}>
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '2px solid #e1e5e9',
                                borderRadius: '10px',
                                fontSize: '16px',
                                transition: 'border-color 0.3s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                            placeholder={isLogin ? "password123" : "La tua password"}
                        />
                    </div>

                    {!isLogin && (
                        <>
                            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ 
                                        display: 'block', 
                                        marginBottom: '8px', 
                                        color: '#333',
                                        fontWeight: '500'
                                    }}>
                                        Nome
                                    </label>
                                    <input
                                        type="text"
                                        name="nome"
                                        value={formData.nome}
                                        onChange={handleInputChange}
                                        required={!isLogin}
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            border: '2px solid #e1e5e9',
                                            borderRadius: '10px',
                                            fontSize: '16px'
                                        }}
                                        placeholder="Mario"
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ 
                                        display: 'block', 
                                        marginBottom: '8px', 
                                        color: '#333',
                                        fontWeight: '500'
                                    }}>
                                        Cognome
                                    </label>
                                    <input
                                        type="text"
                                        name="cognome"
                                        value={formData.cognome}
                                        onChange={handleInputChange}
                                        required={!isLogin}
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            border: '2px solid #e1e5e9',
                                            borderRadius: '10px',
                                            fontSize: '16px'
                                        }}
                                        placeholder="Rossi"
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ 
                                    display: 'block', 
                                    marginBottom: '8px', 
                                    color: '#333',
                                    fontWeight: '500'
                                }}>
                                    Telefono
                                </label>
                                <input
                                    type="tel"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        border: '2px solid #e1e5e9',
                                        borderRadius: '10px',
                                        fontSize: '16px'
                                    }}
                                    placeholder="3331234567"
                                />
                            </div>
                        </>
                    )}

                    {message && (
                        <div style={{
                            padding: '12px',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            textAlign: 'center',
                            background: message.includes('✅') ? 
                                'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                            color: message.includes('✅') ? '#4CAF50' : '#f44336',
                            fontWeight: '500'
                        }}>
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '15px',
                            background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea, #764ba2)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            marginBottom: '20px',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {loading ? '⏳ Caricamento...' : (isLogin ? '🔐 Accedi' : '📝 Registrati')}
                    </button>
                </form>

                <div style={{ textAlign: 'center' }}>
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setMessage('');
                            setFormData({
                                username: '',
                                password: '',
                                nome: '',
                                cognome: '',
                                telefono: ''
                            });
                        }}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#667eea',
                            cursor: 'pointer',
                            fontSize: '16px',
                            textDecoration: 'underline'
                        }}
                    >
                        {isLogin ? 
                            "Non hai un account? Registrati" : 
                            "Hai già un account? Accedi"
                        }
                    </button>
                </div>

                {isLogin && (
                    <div style={{ 
                        marginTop: '20px', 
                        padding: '15px', 
                        background: 'rgba(255, 193, 7, 0.1)', 
                        borderRadius: '10px',
                        fontSize: '14px',
                        color: '#856404'
                    }}>
                        <strong>💡 Account di test:</strong><br/>
                        Username: mario.rossi | Password: password123<br/>
                        Username: giulia.bianchi | Password: password123
                    </div>
                )}
            </div>
        </div>
    );
}

// App principale con routing
export default function App() {
    console.log("🎯 App completa con routing caricata");
    
    return (
        <Router>
            <div>
                <Navbar />                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/listings" element={<ListingsPage />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/crea" element={<CreateAnnouncement />} />
                    <Route path="/inbox" element={<InboxPage />} />
                    <Route path="/dashboard" element={<UserDashboard />} />
                    <Route path="/annuncio/:id" element={<AnnouncementDetail />} />
                </Routes>
                <ToastContainer />
            </div>
        </Router>
    );
}
