// Enhanced App.jsx with new advanced features
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import CreateAnnouncement from './components/CreateAnnouncement';
import InboxPage from './components/InboxPage';
import UserDashboard from './components/UserDashboard';
import AnnouncementDetail from './components/AnnouncementDetail';
import Navbar from './components/Navbar';
import ToastContainer, { showToast } from './components/ToastContainer';
import AdvancedFilters from './components/AdvancedFilters';
import SearchAutocomplete from './components/SearchAutocomplete';
import StatsDashboard from './components/StatsDashboard';
import NotificationCenter from './components/NotificationCenter';

// Enhanced Homepage
function HomePage() {
    const navigate = useNavigate();
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Hero Section */}
                <section className="text-center py-20">
                    <div className="relative">
                        <h1 className="text-6xl font-bold text-gray-800 mb-6">
                            🏠 <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                AlloggiFinder
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                            La piattaforma più avanzata per trovare il tuo alloggio ideale. 
                            Ricerca intelligente, filtri avanzati, e molto altro.
                        </p>
                        
                        {/* Search Bar */}
                        <div className="max-w-md mx-auto mb-8">
                            <SearchAutocomplete 
                                onSelect={(city) => navigate(`/listings?city=${city}`)}
                                placeholder="Cerca la tua città ideale..."
                            />
                        </div>

                        <div className="flex flex-wrap justify-center gap-4">
                            <button
                                onClick={() => navigate('/listings')}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                🔍 Esplora alloggi
                            </button>
                            <button
                                onClick={() => navigate('/crea')}
                                className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-8 py-4 rounded-xl hover:from-green-600 hover:to-teal-700 transition-all font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                📝 Pubblica annuncio
                            </button>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-16">
                    <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
                        ✨ Funzionalità avanzate
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2">
                            <div className="text-4xl mb-4">🔍</div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Ricerca intelligente</h3>
                            <p className="text-gray-600">Filtri avanzati, ricerca per università, geolocalizzazione e molto altro.</p>
                        </div>
                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2">
                            <div className="text-4xl mb-4">💬</div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Chat integrata</h3>
                            <p className="text-gray-600">Comunica direttamente con i proprietari senza scambiare contatti personali.</p>
                        </div>
                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2">
                            <div className="text-4xl mb-4">📊</div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Dashboard completa</h3>
                            <p className="text-gray-600">Monitora le performance dei tuoi annunci con statistiche dettagliate.</p>
                        </div>
                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2">
                            <div className="text-4xl mb-4">🗺️</div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Mappa interattiva</h3>
                            <p className="text-gray-600">Visualizza gli alloggi su mappa e trova quelli più vicini a te.</p>
                        </div>
                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2">
                            <div className="text-4xl mb-4">🔔</div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Notifiche smart</h3>
                            <p className="text-gray-600">Ricevi notifiche per nuovi messaggi e aggiornamenti importanti.</p>
                        </div>
                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2">
                            <div className="text-4xl mb-4">🛡️</div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Sicurezza garantita</h3>
                            <p className="text-gray-600">Piattaforma sicura con autenticazione avanzata e protezione dati.</p>
                        </div>
                    </div>
                </section>

                {/* Statistics Section */}
                <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl text-white">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold mb-12">📈 AlloggiFinder in numeri</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div>
                                <div className="text-4xl font-bold mb-2">1000+</div>
                                <div className="text-blue-100">Alloggi disponibili</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold mb-2">500+</div>
                                <div className="text-blue-100">Utenti registrati</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold mb-2">50+</div>
                                <div className="text-blue-100">Città coperte</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold mb-2">98%</div>
                                <div className="text-blue-100">Soddisfazione utenti</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 text-center">
                    <h2 className="text-4xl font-bold text-gray-800 mb-6">
                        Pronto a trovare casa?
                    </h2>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Unisciti a migliaia di studenti e lavoratori che hanno già trovato 
                        il loro alloggio ideale con AlloggiFinder.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button
                            onClick={() => navigate('/auth')}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            🚀 Inizia ora - È gratis!
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}

// Enhanced Dashboard Page
function EnhancedDashboard() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        📊 Dashboard Avanzata
                    </h1>
                    <p className="text-xl text-gray-600">
                        Monitora le performance dei tuoi annunci e gestisci la tua attività
                    </p>
                </div>
                <StatsDashboard />
            </div>
        </div>
    );
}

// Simple component wrapper - will be used if complex components aren't ready
function SimpleComponent({ title, emoji, description }) {
    return (
        <div style={{
            padding: '40px',
            textAlign: 'center',
            background: 'rgba(255,255,255,0.9)',
            borderRadius: '20px',
            margin: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>{emoji}</div>
            <h2 style={{ fontSize: '2rem', marginBottom: '15px', color: '#333' }}>{title}</h2>
            <p style={{ fontSize: '1.1rem', color: '#666', lineHeight: '1.6' }}>{description}</p>
        </div>
    );
}

// Enhanced Listings Page with new filters
function EnhancedListingsPage() {
    const [filters, setFilters] = React.useState({});
    
    const handleFiltersChange = (newFilters) => {
        setFilters(newFilters);
        showToast('Filtri applicati!', 'success');
    };

    const handleReset = () => {
        setFilters({});
        showToast('Filtri resettati', 'info');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        🏠 Trova il tuo alloggio ideale
                    </h1>
                    <p className="text-xl text-gray-600">
                        Utilizza i nostri filtri avanzati per trovare esattamente quello che cerchi
                    </p>
                </div>
                
                <AdvancedFilters 
                    filters={filters} 
                    onFiltersChange={handleFiltersChange}
                    onReset={handleReset}
                />
                
                <div className="text-center py-8">
                    <p className="text-gray-600">
                        I risultati della ricerca verranno mostrati qui con i filtri selezionati.
                    </p>
                </div>
            </div>
        </div>
    );
}

// Main App Component
export default function EnhancedApp() {
    console.log("🚀 Enhanced AlloggiFinder App starting...");
    
    return (
        <Router>
            <div className="min-h-screen">
                <Navbar />
                <NotificationCenter />
                
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/listings" element={<EnhancedListingsPage />} />
                    <Route path="/dashboard" element={<EnhancedDashboard />} />
                    
                    {/* Original routes */}
                    <Route path="/crea" element={<CreateAnnouncement />} />
                    <Route path="/inbox" element={<InboxPage />} />
                    <Route path="/user-dashboard" element={<UserDashboard />} />
                    <Route path="/annuncio/:id" element={<AnnouncementDetail />} />
                    
                    {/* Simple fallback components */}
                    <Route path="/auth" element={
                        <SimpleComponent 
                            title="Autenticazione" 
                            emoji="🔐" 
                            description="Sistema di login e registrazione sicuro per accedere a tutte le funzionalità della piattaforma."
                        />
                    } />
                    
                    <Route path="/i-miei-annunci" element={
                        <SimpleComponent 
                            title="I tuoi annunci" 
                            emoji="📋" 
                            description="Gestisci tutti i tuoi annunci pubblicati, modifica i dettagli e monitora le performance."
                        />
                    } />

                    <Route path="/profilo" element={
                        <SimpleComponent 
                            title="Profilo utente" 
                            emoji="👤" 
                            description="Gestisci le informazioni del tuo profilo e le preferenze dell'account."
                        />
                    } />
                </Routes>
                
                <ToastContainer />
            </div>
        </Router>
    );
}
