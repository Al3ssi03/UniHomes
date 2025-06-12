// App con stili inline per evitare problemi CSS
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import EnhancedListingsPage from './pages/EnhancedListingsPage';
import EnhancedLoginRegisterPage from './pages/EnhancedLoginRegisterPage';
import UserListingsPage from './pages/UserListingsPage';
import InboxPage from './pages/InboxPage';
import UserProfilePage from './pages/UserProfilePage';
import CreateListingForm from './components/CreateListingForm';
import Navbar from './components/Navbar';
import SearchAutocomplete from './components/SearchAutocomplete';
import AdvancedFilters from './components/AdvancedFilters';
import PriceRangeSlider from './components/PriceRangeSlider';
import StatsDashboard from './components/StatsDashboard';
import NotificationCenter from './components/NotificationCenter';

// Stili inline come fallback
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px'
  },
  heroSection: {
    textAlign: 'center',
    padding: '60px 20px',
    color: 'white'
  },
  title: {
    fontSize: '4rem',
    fontWeight: 'bold',
    marginBottom: '20px',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
  },
  subtitle: {
    fontSize: '1.2rem',
    marginBottom: '40px',
    opacity: 0.9,
    maxWidth: '600px',
    margin: '0 auto 40px auto'
  },
  searchBox: {
    maxWidth: '400px',
    margin: '0 auto 40px auto'
  },
  input: {
    width: '100%',
    padding: '15px 20px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '12px',
    outline: 'none',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
  },
  buttonPrimary: {
    background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
    color: 'white',
    padding: '15px 30px',
    margin: '10px',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    transition: 'transform 0.2s',
  },
  buttonSecondary: {
    background: 'linear-gradient(45deg, #16a34a, #059669)',
    color: 'white',
    padding: '15px 30px',
    margin: '10px',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    transition: 'transform 0.2s',
  },
  featuresSection: {
    padding: '60px 20px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
    marginTop: '40px'
  },
  featureCard: {
    background: 'rgba(255,255,255,0.95)',
    padding: '30px',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    textAlign: 'center',
    transition: 'transform 0.3s',
    cursor: 'pointer'
  },
  featureIcon: {
    fontSize: '3rem',
    marginBottom: '15px'
  },
  featureTitle: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#333'
  },
  featureDescription: {
    color: '#666',
    lineHeight: '1.6'
  },
  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    marginBottom: '20px'
  }
};

// Componente SearchBox semplificato
function SimpleSearchBox({ onSearch }) {
  const [query, setQuery] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <div style={styles.searchBox}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 Cerca la tua città ideale..."
          style={styles.input}
        />
      </form>
    </div>
  );
}

// Navbar semplificata
function SimpleNavbar() {
  const navigate = useNavigate();

  return (
    <nav style={{
      background: 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(10px)',
      padding: '15px 30px',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ 
        fontSize: '1.5rem', 
        fontWeight: 'bold', 
        color: 'white',
        cursor: 'pointer'
      }} onClick={() => navigate('/')}>
        🏠 AlloggiFinder
      </div>
      <div>
        <button 
          onClick={() => navigate('/listings')}
          style={{
            ...styles.buttonPrimary,
            padding: '8px 16px',
            fontSize: '14px',
            margin: '0 5px'
          }}
        >
          Annunci
        </button>
        <button 
          onClick={() => navigate('/auth')}
          style={{
            ...styles.buttonSecondary,
            padding: '8px 16px',
            fontSize: '14px',
            margin: '0 5px'
          }}
        >
          Accedi
        </button>
      </div>
    </nav>
  );
}

// Homepage
function HomePage() {
  const navigate = useNavigate();

  const handleSearch = (query) => {
    navigate(`/listings?city=${encodeURIComponent(query)}`);
  };

  const features = [
    {
      icon: '🔍',
      title: 'Ricerca intelligente',
      description: 'Filtri avanzati, ricerca per università, geolocalizzazione e molto altro.'
    },
    {
      icon: '💬',
      title: 'Chat integrata',
      description: 'Comunica direttamente con i proprietari senza scambiare contatti personali.'
    },
    {
      icon: '📊',
      title: 'Dashboard completa',
      description: 'Monitora le performance dei tuoi annunci con statistiche dettagliate.'
    },
    {
      icon: '🗺️',
      title: 'Mappa interattiva',
      description: 'Visualizza gli alloggi su mappa e trova quelli più vicini a te.'
    },
    {
      icon: '🔔',
      title: 'Notifiche smart',
      description: 'Ricevi notifiche per nuovi messaggi e aggiornamenti importanti.'
    },
    {
      icon: '🛡️',
      title: 'Sicurezza garantita',
      description: 'Piattaforma sicura con autenticazione avanzata e protezione dati.'
    }
  ];

  return (
    <div style={styles.container}>
      <div style={{ paddingTop: '80px' }}>
        {/* Hero Section */}
        <section style={styles.heroSection}>
          <h1 style={styles.title}>🏠 AlloggiFinder</h1>
          <p style={styles.subtitle}>
            La piattaforma più avanzata per trovare il tuo alloggio ideale. 
            Ricerca intelligente, filtri avanzati, e molto altro.
          </p>
          
          <SimpleSearchBox onSearch={handleSearch} />

          <div>
            <button
              onClick={() => navigate('/listings')}
              style={styles.buttonPrimary}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              🔍 Esplora alloggi
            </button>
            <button
              onClick={() => navigate('/crea')}
              style={styles.buttonSecondary}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              📝 Pubblica annuncio
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section style={styles.featuresSection}>
          <h2 style={styles.sectionTitle}>✨ Funzionalità avanzate</h2>
          <div style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div 
                key={index} 
                style={styles.featureCard}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-5px)'}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                <div style={styles.featureIcon}>{feature.icon}</div>
                <h3 style={styles.featureTitle}>{feature.title}</h3>
                <p style={styles.featureDescription}>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Statistics Section */}
        <section style={{
          ...styles.featuresSection,
          background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
          borderRadius: '30px',
          color: 'white',
          textAlign: 'center'
        }}>
          <h2 style={{ ...styles.sectionTitle, color: 'white' }}>📈 AlloggiFinder in numeri</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '30px',
            marginTop: '40px'
          }}>
            {[
              { number: '1000+', label: 'Alloggi disponibili' },
              { number: '500+', label: 'Utenti registrati' },
              { number: '50+', label: 'Città coperte' },
              { number: '98%', label: 'Soddisfazione utenti' }
            ].map((stat, index) => (
              <div key={index}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '10px' }}>
                  {stat.number}
                </div>
                <div style={{ opacity: 0.9 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section style={{
          ...styles.heroSection,
          paddingTop: '40px',
          paddingBottom: '40px'
        }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '20px' }}>
            Pronto a trovare casa?
          </h2>
          <p style={{ ...styles.subtitle, marginBottom: '30px' }}>
            Unisciti a migliaia di studenti e lavoratori che hanno già trovato 
            il loro alloggio ideale con AlloggiFinder.
          </p>
          <button
            onClick={() => navigate('/auth')}
            style={{
              ...styles.buttonPrimary,
              fontSize: '18px',
              padding: '18px 35px'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            🚀 Inizia ora - È gratis!
          </button>
        </section>
      </div>
    </div>
  );
}

// Pagina semplice per altre rotte
function SimplePage({ title, emoji, description }) {
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
        background: 'rgba(255,255,255,0.95)',
        padding: '60px',
        borderRadius: '20px',
        textAlign: 'center',
        maxWidth: '600px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.1)'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>{emoji}</div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#333' }}>{title}</h1>
        <p style={{ fontSize: '1.1rem', color: '#666', lineHeight: '1.6' }}>{description}</p>
      </div>
    </div>
  );
}

// App principale
export default function AppWithInlineStyles() {
  console.log("🚀 AlloggiFinder con stili inline - Avvio...");
  return (
    <Router>
      <div>
        <Navbar />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
            <Route path="/listings" element={<EnhancedListingsPage />} />
          <Route path="/listings-enhanced" element={<EnhancedListingsPage />} />
          
          <Route path="/demo-components" element={
            <div style={{ padding: '20px', background: '#f0f9ff', minHeight: '100vh' }}>
              <h1 style={{ textAlign: 'center', marginBottom: '40px', color: '#1e40af' }}>
                🧪 Demo Componenti Avanzati
              </h1>
              
              <div style={{ maxWidth: '800px', margin: '0 auto', background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                <h2 style={{ marginBottom: '20px', color: '#374151' }}>🔍 SearchAutocomplete</h2>
                <SearchAutocomplete onCitySelect={(city) => console.log('Selected:', city)} />
                
                <hr style={{ margin: '40px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />
                
                <h2 style={{ marginBottom: '20px', color: '#374151' }}>💰 PriceRangeSlider</h2>
                <PriceRangeSlider 
                  min={0} 
                  max={2000} 
                  value={[300, 800]} 
                  onChange={(min, max) => console.log('Price range:', min, max)} 
                />
                
                <hr style={{ margin: '40px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />
                
                <h2 style={{ marginBottom: '20px', color: '#374151' }}>📊 StatsDashboard</h2>
                <StatsDashboard />
                
                <hr style={{ margin: '40px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />
                
                <h2 style={{ marginBottom: '20px', color: '#374151' }}>🔔 NotificationCenter</h2>
                <NotificationCenter />
              </div>
            </div>
          } />
          
          <Route path="/crea" element={
            <SimplePage 
              title="Pubblica Annuncio" 
              emoji="📝" 
              description="Pubblica il tuo alloggio e raggiungi migliaia di potenziali inquilini."
            />
          } />          <Route path="/auth" element={<EnhancedLoginRegisterPage />} />
          
          <Route path="/crea" element={<CreateListingForm />} />
          
          <Route path="/i-miei-annunci" element={<UserListingsPage />} />
          
          <Route path="/inbox" element={<InboxPage />} />
          
          <Route path="/profilo" element={<UserProfilePage />} />
          
          <Route path="/dashboard" element={
            <SimplePage 
              title="Dashboard" 
              emoji="📊" 
              description="Monitora le performance dei tuoi annunci e gestisci la tua attività."
            />
          } />
        </Routes>
      </div>
    </Router>
  );
}
